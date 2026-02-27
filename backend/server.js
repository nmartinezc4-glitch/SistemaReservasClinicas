// Importa la conexión a la base de datos (pool de MySQL)
const db = require("./db");

// Framework para crear el servidor y manejar rutas HTTP
const express = require("express");

// Permite que el frontend (puerto 5173) pueda comunicarse con el backend (puerto 3000)
const cors = require("cors");

// Se crea la aplicación Express
const app = express();

// Habilita CORS para aceptar peticiones externas
app.use(cors());

// Permite que el servidor entienda datos en formato JSON (req.body)
app.use(express.json());

// Ruta raíz para verificar que la API está funcionando
app.get("/", (req, res) => {
  res.send("API Clínica funcionando correctamente");
});

// ========================= PACIENTES =========================

// Crear un nuevo paciente
app.post("/pacientes", (req, res) => {
  const { nombre, dpi, telefono, correo } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !dpi || !telefono || !correo) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Consulta parametrizada para evitar inyección SQL
  const sql =
    "INSERT INTO pacientes (nombre, dpi, telefono, correo) VALUES (?, ?, ?, ?)";

  db.query(sql, [nombre, dpi, telefono, correo], (err) => {
    if (err) {
      // Manejo específico de error por duplicado (DPI o correo único)
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          error: "Ya existe un paciente con ese DPI o correo",
        });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }

    res.json({ message: "Paciente creado correctamente" });
  });
});

// Obtener todos los pacientes registrados
app.get("/pacientes", (req, res) => {
  db.query("SELECT * FROM pacientes", (err, results) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener pacientes" });

    res.json(results);
  });
});

// Actualizar información de un paciente existente
app.put("/pacientes/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, dpi, telefono, correo } = req.body;

  if (!nombre || !dpi || !telefono || !correo) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql =
    "UPDATE pacientes SET nombre=?, dpi=?, telefono=?, correo=? WHERE id=?";

  db.query(sql, [nombre, dpi, telefono, correo, id], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ error: "Ya existe otro paciente con ese DPI o correo" });
      }

      return res.status(500).json({ error: "Error al actualizar paciente" });
    }

    res.json({ message: "Paciente actualizado correctamente" });
  });
});

// Elimina un paciente por ID
app.delete("/pacientes/:id", (req, res) => {
  db.query("DELETE FROM pacientes WHERE id=?", [req.params.id], (err) => {
    if (err)
      return res.status(500).json({ error: "Error al eliminar paciente" });

    res.json({ message: "Paciente eliminado correctamente" });
  });
});

// ========================= DOCTORES =========================

// Crear doctor
app.post("/doctores", (req, res) => {
  const { nombre, especialidad, telefono, correo } = req.body;

  if (!nombre || !especialidad || !telefono || !correo) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql =
    "INSERT INTO doctores (nombre, especialidad, telefono, correo) VALUES (?, ?, ?, ?)";

  db.query(sql, [nombre, especialidad, telefono, correo], (err) => {
    if (err) {
      return res.status(500).json({ error: "Error al agregar doctor" });
    }

    res.json({ message: "Doctor creado correctamente" });
  });
});

// Obtener doctores
app.get("/doctores", (req, res) => {
  db.query("SELECT * FROM doctores", (err, results) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener doctores" });
    res.json(results);
  });
});

// Actualizar doctor
app.put("/doctores/:id", (req, res) => {
  const { nombre, especialidad, telefono, correo } = req.body;

  if (!nombre || !especialidad || !telefono || !correo) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql =
    "UPDATE doctores SET nombre=?, especialidad=?, telefono=?, correo=? WHERE id=?";

  db.query(
    sql,
    [nombre, especialidad, telefono, correo, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al actualizar doctor" });
      }

      res.json({ message: "Doctor actualizado correctamente" });
    },
  );
});

// Eliminar doctor
app.delete("/doctores/:id", (req, res) => {
  db.query("DELETE FROM doctores WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Error al eliminar doctor" });
    res.json({ message: "Doctor eliminado correctamente" });
  });
});

// ========================= CITAS =========================

// Crear cita
app.post("/citas", (req, res) => {
  const { paciente_id, doctor_id, fecha, hora_inicio, hora_fin } = req.body;

  const hoy = new Date().toISOString().split("T")[0];

  if (fecha < hoy)
    return res.status(400).json({ error: "No se permiten fechas pasadas" });

  if (hora_inicio < "08:00" || hora_fin > "17:00")
    return res.status(400).json({ error: "Horario laboral: 8am a 5pm" });

  if (hora_fin <= hora_inicio)
    return res
      .status(400)
      .json({ error: "Hora final debe ser mayor a hora inicial" });

  // Validación de conflicto de horarios para el mismo doctor
  const sqlConflicto = `
  SELECT * FROM citas
  WHERE doctor_id = ?
  AND fecha = ?
  AND hora_inicio < ?
  AND hora_fin > ?
`;

  db.query(
    sqlConflicto,
    [doctor_id, fecha, hora_fin, hora_inicio],
    (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({
          error:
            "Horario no disponible. El doctor ya tiene una cita en ese rango.",
        });
      }

      const insert = `
        INSERT INTO citas (paciente_id, doctor_id, fecha, hora_inicio, hora_fin, estado)
        VALUES (?, ?, ?, ?, ?, 'Pendiente')
      `;

      db.query(
        insert,
        [paciente_id, doctor_id, fecha, hora_inicio, hora_fin],
        (err2) => {
          if (err2)
            return res.status(500).json({ error: "Error al crear cita" });

          res.json({ message: "Cita agendada correctamente (Pendiente)" });
        },
      );
    },
  );
});

// Obtener citas (actualiza automáticamente a Finalizado)
app.get("/citas", (req, res) => {
  db.query(`
    UPDATE citas
    SET estado='Finalizado'
    WHERE fecha < CURDATE()
    OR (fecha = CURDATE() AND hora_fin < CURTIME())
  `);

  const sql = `
    SELECT citas.*, pacientes.nombre AS paciente, doctores.nombre AS doctor
    FROM citas
    JOIN pacientes ON citas.paciente_id = pacientes.id
    JOIN doctores ON citas.doctor_id = doctores.id
    ORDER BY fecha DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener citas" });
    res.json(results);
  });
});

// Cancelar cita
app.put("/citas/:id/cancelar", (req, res) => {
  const sqlCancelar = "UPDATE citas SET estado = 'Cancelado' WHERE id = ?";

  db.query(sqlCancelar, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Error al cancelar cita" });

    res.json({ message: "Cita cancelada correctamente" });
  });
});

// Finalizar manualmente
app.put("/citas/:id/finalizar", (req, res) => {
  const sql = "UPDATE citas SET estado = 'Finalizado' WHERE id = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Error al finalizar cita" });

    res.json({ message: "Cita finalizada correctamente" });
  });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
