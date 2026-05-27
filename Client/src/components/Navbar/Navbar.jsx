import "./Navbar.css";
import ImgPerfilBBox from "../../assets/ImgPerfilBBox.png";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/useCart";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <Link to="/">
        <div className="navbar-logo">
          <h1>BigBox</h1>
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
      </div>
    </nav>
  );
}

export default Navbar;
