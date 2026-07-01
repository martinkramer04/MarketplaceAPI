import "./Navbar.css";
import ImgPerfilBBox from "../../assets/ImgPerfilBBox.png";
import { useCart } from "../../Context/useCart";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/userSlice";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <div className="navbar-logo">
          <h1>Boxify</h1>
        </div>
      </Link>

      <ul className="navbar-links">
        <Link to="/explore">
          <li>Explorar</li>
        </Link>
        <Link to="/como-funciona">
          <li>¿Cómo funciona?</li>
        </Link>
        <Link to="/nosotros">
          <li>Nosotros</li>
        </Link>
      </ul>

      <div className="navbar-actions">
        <Link to="/become-provider" className="btn-become-provider">
          Hacete proveedor
        </Link>
        <Link to="/cart">
          <div className="cart-icon">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </Link>
        <Link to="/perfil">
          <img src={ImgPerfilBBox} alt="User Profile" className="navbar-profile-avatar" />
        </Link>
        <button onClick={handleLogout} className="btn-become-provider">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
