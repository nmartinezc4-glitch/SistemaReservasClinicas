// Importamos hooks de React
// useState -> Manejo de estado
// useEffect -> Efectos secundarios (carga inicial, intervalos, etc.)
import { useState, useEffect } from "react";

function Citas() {
  // ESTADOS PRINCIPALES
  // Lista de citas
  const [citas, setCitas] = useState([]);

  // Listas para los select (relaciones)
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);

  // Estados del formulario
  const [pacienteId, setPacienteId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  // FUNCIÓN PARA RECARGAR CITAS
  const recargar = async () => {
    try {
      const res = await fetch("http://localhost:3000/citas");
      const data = await res.json();
      setCitas(data);
    } catch {
      alert("Error al cargar citas");
    }
  };

  // CARGA INICIAL (DATOS RELACIONADOS)
  // Se ejecuta al montar el componente
  useEffect(() => {
    async function fetchData() {
      try {
        // Promise.all permite hacer múltiples peticiones en paralelo
        const [resCitas, resPacientes, resDoctores] = await Promise.all([
          fetch("http://localhost:3000/citas"),
          fetch("http://localhost:3000/pacientes"),
          fetch("http://localhost:3000/doctores"),
        ]);

        // Guardamos los datos en sus respectivos estados
        setCitas(await resCitas.json());
        setPacientes(await resPacientes.json());
        setDoctores(await resDoctores.json());
      } catch {
        alert("Error al cargar datos");
      }
    }

    fetchData();
  }, []);

  // ACTUALIZACIÓN AUTOMÁTICA
  // Cada 5 segundos se actualizan las citas automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      recargar();
    }, 5000);

    // Limpieza del intervalo al desmontar componente
    return () => clearInterval(interval);
  }, []);

  // CREAR CITA (POST)
  const crearCita = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paciente_id: pacienteId,
        doctor_id: doctorId,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    // Limpiamos formulario
    setPacienteId("");
    setDoctorId("");
    setFecha("");
    setHoraInicio("");
    setHoraFin("");

    await recargar();
  };

  // CANCELAR CITA (PUT)
  const cancelarCita = async (id) => {
    const res = await fetch(`http://localhost:3000/citas/${id}/cancelar`, {
      method: "PUT",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    await recargar();
  };

  // FINALIZAR CITA (PUT)
  const finalizarCita = async (id) => {
    const res = await fetch(`http://localhost:3000/citas/${id}/finalizar`, {
      method: "PUT",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    await recargar();
  };

  // CLASE CSS SEGÚN ESTADO
  // Devuelve clase dinámica según el estado
  const estadoClase = (estado) => {
    if (!estado) return "estado";

    switch (estado) {
      case "Pendiente":
        return "estado pendiente";
      case "Finalizado":
        return "estado finalizado";
      case "Cancelado":
        return "estado cancelado";
      default:
        return "estado";
    }
  };

  // FORMATEAR FECHA
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-GT");
  };

  // RENDERIZADO
  return (
    <div className="card">
      <h2>Gestión de Citas</h2>

      {/* FORMULARIO PARA CREAR CITA */}
      <form onSubmit={crearCita}>
        {/* Select Pacientes */}
        <select
          value={pacienteId}
          onChange={(e) => setPacienteId(e.target.value)}
          required
        >
          <option value="">Seleccione Paciente</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        {/* Select Doctores */}
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        >
          <option value="">Seleccione Doctor</option>
          {doctores.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>

        {/* Fecha y Horarios */}
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          required
        />

        <input
          type="time"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
          required
        />

        <button type="submit">Agendar</button>
      </form>

      {/* LISTA DE CITAS */}
      <ul>
        {citas.map((c) => (
          <li key={c.id}>
            <div>
              <strong>{c.paciente}</strong> — {c.doctor}
              <br />
              {formatearFecha(c.fecha)} | {c.hora_inicio} - {c.hora_fin}
              <br />
              <span className={estadoClase(c.estado)}>{c.estado}</span>
            </div>

            {/* Botones solo si está pendiente */}
            {c.estado === "Pendiente" && (
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <button
                  onClick={() => finalizarCita(c.id)}
                  style={{ backgroundColor: "#22c55e", color: "white" }}
                >
                  Finalizar
                </button>

                <button
                  onClick={() => cancelarCita(c.id)}
                  style={{ backgroundColor: "#ef4444", color: "white" }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Citas;
