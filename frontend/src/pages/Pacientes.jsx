// Importamos los hooks necesarios desde React
// useState -> para manejar estados del componente
// useEffect -> para ejecutar efectos secundarios (como cargar datos)
import { useState, useEffect } from "react";

function Pacientes() {
  // ESTADOS DEL COMPONENTE
  // Lista de pacientes obtenida desde el backend
  const [pacientes, setPacientes] = useState([]);

  // Estados del formulario (componentes controlados)
  const [nombre, setNombre] = useState("");
  const [dpi, setDpi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  // Estados para controlar el modo edición
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  // CARGA INICIAL DE DATOS
  // Se ejecuta una sola vez cuando el componente se monta
  useEffect(() => {
    async function fetchData() {
      try {
        // Petición GET al backend para obtener pacientes
        const res = await fetch("http://localhost:3000/pacientes");
        const data = await res.json();

        // Guardamos los datos en el estado
        setPacientes(data);
      } catch {
        // Manejo básico de error
        alert("Error al cargar pacientes");
      }
    }

    fetchData();
  }, []); // [] significa que solo se ejecuta una vez

  // FUNCIÓN PARA RECARGAR DATOS
  // Se usa después de agregar, editar o eliminar
  const recargar = async () => {
    const res = await fetch("http://localhost:3000/pacientes");
    const data = await res.json();
    setPacientes(data);
  };

  // GUARDAR PACIENTE (CREATE / UPDATE)
  const guardarPaciente = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    // Si estamos editando, usamos PUT con ID
    // Si no, usamos POST para crear nuevo paciente
    const url = editando
      ? `http://localhost:3000/pacientes/${idEditar}`
      : "http://localhost:3000/pacientes";

    const metodo = editando ? "PUT" : "POST";

    // Enviamos datos al backend en formato JSON
    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, dpi, telefono, correo }),
    });

    const data = await res.json();

    // Si el backend devuelve error (ej: DPI duplicado)
    if (!res.ok) {
      alert(data.error);
      return;
    }

    // Mensaje de éxito
    alert(data.message);

    // Limpiamos formulario y actualizamos lista
    limpiarFormulario();
    await recargar();
  };

  // CARGAR DATOS EN MODO EDICIÓN
  const editarPaciente = (p) => {
    // Cargamos datos del paciente en el formulario
    setNombre(p.nombre);
    setDpi(p.dpi);
    setTelefono(p.telefono);
    setCorreo(p.correo);

    // Guardamos ID y activamos modo edición
    setIdEditar(p.id);
    setEditando(true);
  };

  // ELIMINAR PACIENTE
  const eliminarPaciente = async (id) => {
    await fetch(`http://localhost:3000/pacientes/${id}`, {
      method: "DELETE",
    });

    // Recargamos lista después de eliminar
    await recargar();
  };

  // LIMPIAR FORMULARIO
  const limpiarFormulario = () => {
    setNombre("");
    setDpi("");
    setTelefono("");
    setCorreo("");
    setEditando(false);
    setIdEditar(null);
  };

  // RENDERIZADO DEL COMPONENTE
  return (
    <div className="card">
      <h2>Pacientes</h2>

      {/* Formulario controlado */}
      <form onSubmit={guardarPaciente}>
        <input
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          placeholder="DPI"
          value={dpi}
          onChange={(e) => setDpi(e.target.value)}
          required
          disabled={editando} // No se permite modificar DPI en edición
        />

        <input
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        {/* Botón cambia dinámicamente según el modo */}
        <button type="submit">{editando ? "Actualizar" : "Agregar"}</button>

        {/* Botón cancelar solo aparece en modo edición */}
        {editando && (
          <button type="button" onClick={limpiarFormulario}>
            Cancelar
          </button>
        )}
      </form>

      {/* Lista dinámica de pacientes */}
      <ul>
        {pacientes.map((p) => (
          <li key={p.id}>
            {p.nombre} - {p.dpi}
            <button onClick={() => editarPaciente(p)}>Editar</button>
            <button onClick={() => eliminarPaciente(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pacientes;
