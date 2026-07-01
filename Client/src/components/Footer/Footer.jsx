import "./Footer.css";
import { Link, useLocation } from "react-router-dom";
function Footer() {
  const location = useLocation();

  const isHidden =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/provider");

  if (isHidden) return null;
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-logo">Boxify</span>
        <p>
          Redefining the art of gifting with curated life events and premium
          culinary experiences.
        </p>
        <p>© 2026 Boxify Marketplace. All rights reserved.</p>
      </div>

      <div className="footer-links">
        <span>
          <Link to="/nosotros">Privacy Policy</Link>
        </span>
        <span>
          <Link to="/nosotros">Terms of Service</Link>
        </span>
        <span>
          <Link to="/nosotros">Corporate Gifts</Link>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
