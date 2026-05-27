import './Confirmation.css'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../Context/useCart'
import Stepper from '../../../components/Stepper/Stepper'

function Confirmation() {
    const navigate = useNavigate()
    const { cartItems, clearCart } = useCart()

    const voucherCode = "BB-" + Math.random().toString(36).substring(2, 8).toUpperCase()

    const handleContinue = () => {
        clearCart()
        navigate('/')
    }

    return (
        <div className="confirmation">

            <Stepper currentStep={3} />

            <div className="confirmation-body">

                <div className="confirmation-icon">✓</div>
                <h1>Your gift is on its way!</h1>
                <p className="confirmation-sub">
                    We've sent a confirmation email with all your gift details.
                </p>

                {cartItems.map((item) => (
                    <div key={item.id} className="confirmation-card">
                        <img src={item.image} alt={item.name} />
                        <div className="confirmation-card-info">
                            <span className="confirmation-badge">Digital Gift Ready</span>
                            <h2>{item.name}</h2>
                            <div className="confirmation-meta">
                                <span>📅 Valid for 24 months</span>
                                <span>👥 For 2 People</span>
                            </div>
                            <div className="confirmation-voucher">
                                <span>VOUCHER CODE</span>
                                <strong>{voucherCode}</strong>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="confirmation-actions">
                    <button className="btn-orders" onClick={() => navigate('/perfil')}>
                        View My Orders
                    </button>
                    <button className="btn-continue-shopping" onClick={handleContinue}>
                        Continue Shopping
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Confirmation