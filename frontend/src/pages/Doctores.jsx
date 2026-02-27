// Importamos los hooks necesarios desde React
// useState -> Manejo de estados
// useEffect -> Ejecutar efectos secundarios (como cargar datos al iniciar)
import { useState, useEffect } from "react";

function Doctores() {
  // ESTADOS DEL COMPONENTE
  // Lista de doctores obtenida desde el backend
  const [doctores, setDoctores] = useState([]);

  // Estados del formulario (componentes controlados)
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  // Estados para controlar modo edición
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  // CARGA INICIAL (GET)
  // Se ejecuta solo una vez cuando el componente se monta
  useEffect(() => {
    async function fetchData() {
      try {
        // Petición GET al backend
        const res = await fetch("http://localhost:3000/doctores");
        const data = await res.json();

        // Guardamos datos en el estado
        setDoctores(data);
      } catch {
        alert("Error al cargar doctores");
      }
    }

    fetchData();
  }, []); // [] -> solo se ejecuta una vez

  // RECARGAR LISTA
  // Se utiliza después de crear, editar o eliminar
  const recargar = async () => {
    const res = await fetch("http://localhost:3000/doctores");
    const data = await res.json();
    setDoctores(data);
  };

  // GUARDAR DOCTOR (POST / PUT)
  const guardarDoctor = async (e) => {
    e.preventDefault(); // Evita recargar la página

    // Si estamos editando -> PUT con ID
    // Si no -> POST para crear nuevo
    const url = editando
      ? `http://localhost:3000/doctores/${idEditar}`
      : "http://localhost:3000/doctores";

    const metodo = editando ? "PUT" : "POST";

    // Enviamos datos al backend en formato JSON
    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, especialidad, telefono, correo }),
    });

    const data = await res.json();

    // Validación de errores enviados por el backend
    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert(data.message);

    // Reiniciamos formulario y actualizamos lista
    limpiarFormulario();
    await recargar();
  };

  // ACTIVAR MODO EDICIÓN
  const editarDoctor = (d) => {
    // Cargamos datos del doctor en el formulario
    setNombre(d.nombre);
    setEspecialidad(d.especialidad);
    setTelefono(d.telefono);
    setCorreo(d.correo);

    // Guardamos ID y activamos modo edición
    setIdEditar(d.id);
    setEditando(true);
  };

  // ELIMINAR DOCTOR (DELETE)
  const eliminarDoctor = async (id) => {
    await fetch(`http://localhost:3000/doctores/${id}`, {
      method: "DELETE",
    });

    // Recargamos lista después de eliminar
    await recargar();
  };

  // LIMPIAR FORMULARIO
  const limpiarFormulario = () => {
    setNombre("");
    setEspecialidad("");
    setTelefono("");
    setCorreo("");
    setEditando(false);
    setIdEditar(null);
  };

  // RENDERIZADO (JSX)
  return (
    <div className="card">
      <h2>Doctores</h2>

      {/* Formulario controlado */}
      <form onSubmit={guardarDoctor}>
        <input
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          placeholder="Especialidad"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          required
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

        {/* Botón dinámico según modo */}
        <button type="submit">{editando ? "Actualizar" : "Agregar"}</button>

        {/* Solo aparece si está en modo edición */}
        {editando && (
          <button type="button" onClick={limpiarFormulario}>
            Cancelar
          </button>
        )}
      </form>

      {/* Lista dinámica */}
      <ul>
        {doctores.map((d) => (
          <li key={d.id}>
            {d.nombre} - {d.especialidad}
            <button onClick={() => editarDoctor(d)}>Editar</button>
            <button onClick={() => eliminarDoctor(d.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Doctores;
