// Importa los componentes necesarios para manejar navegación SPA (Single Page Application)
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

// Importa las páginas principales del sistema
import Pacientes from "./pages/Pacientes";
import Doctores from "./pages/Doctores";
import Citas from "./pages/Citas";

// Importa los estilos globales del sistema
import "./App.css";

function App() {
  return (
    // BrowserRouter permite manejar navegación sin recargar la página
    <BrowserRouter>
      {/* Contenedor principal del sistema (estructura general) */}
      <div className="app-container">
        {/* Sidebar lateral con navegación */}
        <div className="sidebar">
          {/* Logo y nombre del sistema */}
          <h1 className="logo">
            {/* Imagen del logo (ubicada en carpeta public) */}
            <img src="/Quetzal.png" alt="Logo Quetzal" className="logo-icon" />
            Clínica <br />
            <span>El Quetzal</span>
          </h1>

          {/* Links que permiten cambiar de página sin recargar */}
          <Link to="/">Pacientes</Link>
          <Link to="/doctores">Doctores</Link>
          <Link to="/citas">Citas</Link>
        </div>

        {/* Contenido dinámico que cambia según la ruta seleccionada */}
        <div className="content">
          <Routes>
            {/* Ruta principal → carga componente Pacientes */}
            <Route path="/" element={<Pacientes />} />

            {/* Ruta doctores */}
            <Route path="/doctores" element={<Doctores />} />

            {/* Ruta citas */}
            <Route path="/citas" element={<Citas />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// Exporta el componente principal
export default App;
