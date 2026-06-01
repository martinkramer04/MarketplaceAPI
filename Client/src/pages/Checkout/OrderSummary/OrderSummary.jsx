import { useState } from 'react'
import './OrderSummary.css'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../Context/useCart'
import Stepper from '../../../components/Stepper/Stepper'

// Cupones válidos hardcodeados, reemplazá con llamada al back cuando esté listo
const VALID_COUPONS = {
    'BIGBOX10': 10,
    'DESCUENTO20': 20,
    'PROMO15': 15,
}

function OrderSummary() {
    const navigate = useNavigate()
    const { cartItems } = useCart()
    const [delivery, setDelivery] = useState('digital')

    // Estados del cupón
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [couponError, setCouponError] = useState('')
    const [couponSuccess, setCouponSuccess] = useState('')

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const deliveryFee = delivery === 'physical' ? 9.99 : 0
    const discountAmount = appliedCoupon ? VALID_COUPONS[appliedCoupon] : 0
    const total = subtotal + deliveryFee - discountAmount

    const handleApplyCoupon = () => {
        setCouponError('')
        setCouponSuccess('')
        const code = couponCode.trim().toUpperCase()

        if (!code) {
            setCouponError('Ingresá un código.')
            return
        }
        if (VALID_COUPONS[code]) {
            setAppliedCoupon(code)
            setCouponSuccess(`¡Cupón aplicado! Descuento de $${VALID_COUPONS[code]}`)
        } else {
            setAppliedCoupon(null)
            setCouponError('Código inválido. Intentá con otro.')
        }
    }

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null)
        setCouponCode('')
        setCouponError('')
        setCouponSuccess('')
    }

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
                            <div
                                className={`os-delivery-option ${delivery === 'digital' ? 'selected' : ''}`}
                                onClick={() => setDelivery('digital')}
                            >
                                <span>✉️</span>
                                <div>
                                    <strong>Digital e-Box</strong>
                                    <p>Sent instantly to your inbox. Eco-friendly and fast.</p>
                                </div>
                            </div>
                            <div
                                className={`os-delivery-option ${delivery === 'physical' ? 'selected' : ''}`}
                                onClick={() => setDelivery('physical')}
                            >
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

                    {/* Cupón — va primero, arriba del desglose */}
                    <div className="os-coupon">
                        <p className="os-coupon-label">Promo Code</p>
                        {!appliedCoupon ? (
                            <div className="os-coupon-input">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                />
                                <button onClick={handleApplyCoupon}>Apply</button>
                            </div>
                        ) : (
                            <div className="os-coupon-applied">
                                <span>🏷️ <strong>{appliedCoupon}</strong></span>
                                <button className="os-coupon-remove" onClick={handleRemoveCoupon}>✕</button>
                            </div>
                        )}
                        {couponError && <p className="os-coupon-error">{couponError}</p>}
                        {couponSuccess && <p className="os-coupon-success">{couponSuccess}</p>}
                    </div>

                    <div className="os-summary-divider" />

                    {/* Desglose de precios */}
                    {cartItems.map((item) => (
                        <div key={item.id} className="os-summary-row">
                            <span>{item.name}</span>
                            <span>${item.price}.00</span>
                        </div>
                    ))}
                    <div className="os-summary-row">
                        <span>Delivery Fee</span>
                        <span className={deliveryFee === 0 ? 'free' : ''}>
                            {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                        </span>
                    </div>
                    {appliedCoupon && (
                        <div className="os-summary-row os-discount-row">
                            <span>Descuento ({appliedCoupon})</span>
                            <span>-${discountAmount}.00</span>
                        </div>
                    )}

                    <div className="os-summary-total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
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