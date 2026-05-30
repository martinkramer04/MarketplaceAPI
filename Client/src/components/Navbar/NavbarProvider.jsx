import "./Navbar.css"; 
import ImgPerfilBBox from "../../assets/ImgPerfilBBox.png";
import { Link } from "react-router-dom";

function NavbarProvider({ isAdmin = false }) {
  return (
    <nav className="navbar">
      <Link to={isAdmin ? "/admin/dashboard" : "/provider/dashboard"}>
        <div className="navbar-logo">
          <h1>BigBox</h1>
        </div>
      </Link>

      <div className="navbar-mode-indicator" style={{
        fontWeight: "600",
        fontSize: "1.1rem",
        backgroundColor: isAdmin ? "#ffebee" : "#f0f0f0",
        color: isAdmin ? "#c62828" : "#333",
        padding: "6px 16px",
        borderRadius: "20px"
      }}>
        {isAdmin ? "Panel Administrador" : "Portal Proveedor"}
      </div>

      <div className="navbar-actions">

        <Link to="/" className="btn-become-provider">
          Volver a la Web
        </Link>

        <Link to="/perfil">
          <img src={ImgPerfilBBox} alt="User Profile" className="navbar-profile-avatar" />
        </Link>
      </div>
    </nav>
  );
}

export default NavbarProvider;