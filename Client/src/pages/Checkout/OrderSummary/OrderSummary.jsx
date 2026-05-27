import './OrderSummary.css'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../Context/useCart'
import Stepper from '../../../components/Stepper/Stepper'

function OrderSummary() {
    const navigate = useNavigate()
    const { cartItems } = useCart()

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

    return (
        <div className="order-summary">

            <Stepper currentStep={1} />

            <div className="order-summary-body">

                {/* IZQUIERDA */}
                <div className="order-summary-left">
                    {cartItems.map((item) => (
                        <div key={item.id} className="os-item">
                            <img src={item.image} alt={item.name} />
                            <div className="os-item-info">
                                <span className="os-item-badge">BEST SELLER</span>
                                <h2>{item.name}</h2>
                                <p>{item.description}</p>
                                <div className="os-item-meta">
                                    <span>📅 Válido 24 meses</span>
                                    <span>👥 2 personas</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="os-delivery">
                        <h3>Choose Your Delivery Method</h3>
                        <div className="os-delivery-options">
                            <div className="os-delivery-option selected">
                                <span>✉️</span>
                                <div>
                                    <strong>Digital e-Box</strong>
                                    <p>Sent instantly to your inbox. Eco-friendly and fast.</p>
                                </div>
                            </div>
                            <div className="os-delivery-option">
                                <span>📦</span>
                                <div>
                                    <strong>Luxury Gift Box</strong>
                                    <p>Premium physical box via FedEx. (+$9.99)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DERECHA */}
                <div className="order-summary-right">
                    <h3>Order Summary</h3>
                    {cartItems.map((item) => (
                        <div key={item.id} className="os-summary-row">
                            <span>{item.name}</span>
                            <span>${item.price}.00</span>
                        </div>
                    ))}
                    <div className="os-summary-row">
                        <span>Delivery Fee</span>
                        <span className="free">Free</span>
                    </div>
                    <div className="os-summary-total">
                        <span>Total</span>
                        <span>${subtotal}.00</span>
                    </div>
                    <button
                        className="btn-continue"
                        onClick={() => navigate('/checkout/payment')}
                    >
                        Continue to Payment →
                    </button>
                    <div className="os-guarantees">
                        <span>📅 24-Month Quality Guarantee</span>
                        <span>🔄 Free exchanges for 30 days</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default OrderSummary