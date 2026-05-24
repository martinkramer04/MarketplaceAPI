import './Navbar.css'
import ImgPerfilBBox from '../../assets/ImgPerfilBBox.png';
function Navbar() {
    return (
        <nav className="navbar">

            <div className="navbar-logo">
                BigBox
            </div>

            <ul className="navbar-links">
                <li>Explorar</li>
                <li>Como funciona</li>
                <li>Nosotros</li>
            </ul>

            <div className="navbar-actions">
                <button className="btn-redeem">Canjea tu regalo</button>
                <span>🛒</span>
                <img
                    src={ImgPerfilBBox}
                    alt="User Profile"
                    className="navbar-profile-avatar"
                />
            </div>

        </nav>
    )
}

export default Navbar