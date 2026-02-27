import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <Link to="/">Pacientes</Link>
      <Link to="/doctores">Doctores</Link>
      <Link to="/citas">Citas</Link>
    </nav>
  );
}

export default Navbar;