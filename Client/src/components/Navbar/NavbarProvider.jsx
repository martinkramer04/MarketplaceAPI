import "./Navbar.css";
import ImgPerfilBBox from "../../assets/ImgPerfilBBox.png";
import { Link, useNavigate } from "react-router-dom";

function NavbarProvider({ isAdmin = false }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_session');
    navigate('/login');
  };
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

        <Link to="/perfil">
          <img src={ImgPerfilBBox} alt="User Profile" className="navbar-profile-avatar" />
        </Link>
        <button onClick={handleLogout} style={{
          cursor: 'pointer',
          padding: '6px 16px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: '#c62828',
          color: 'white',
          fontWeight: '600'
        }}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default NavbarProvider;