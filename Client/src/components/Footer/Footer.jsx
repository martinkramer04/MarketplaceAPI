import './Footer.css'
import { useLocation } from 'react-router-dom'
function Footer() {
    const location = useLocation()

    const isHidden = location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/provider')

    if (isHidden) return null
    return (
        <footer className="footer">

            <div className="footer-brand">
                <span className="footer-logo">BigBox</span>
                <p>Redefining the art of gifting with curated life events and premium culinary experiences.</p>
                <p>© 2026 BigBox Marketplace. All rights reserved.</p>
            </div>

            <div className="footer-links">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Corporate Gifts</span>
            </div>

        </footer>
    )
}

export default Footer