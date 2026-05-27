import './Payment.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../Context/useCart'
import Stepper from '../../../components/Stepper/Stepper'

function Payment() {
    const navigate = useNavigate()
    const { cartItems } = useCart()
    const [paymentMethod, setPaymentMethod] = useState('card')

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

    return (
        <div className="payment">

            <Stepper currentStep={2} />

            <div className="payment-body">

                {/* IZQUIERDA */}
                <div className="payment-left">
                    <div className="payment-methods">
                        <div
                            className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            💳 Credit/Debit Card
                        </div>
                        <div
                            className={`payment-method ${paymentMethod === 'mercadopago' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('mercadopago')}
                        >
                            📱 MercadoPago / PayPal
                        </div>
                        <div
                            className={`payment-method ${paymentMethod === 'transfer' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('transfer')}
                        >
                            🏦 Bank Transfer
                        </div>
                    </div>

                    {paymentMethod === 'card' && (
                        <div className="payment-form">
                            <div className="payment-campo">
                                <label>Cardholder Name</label>
                                <input type="text" placeholder="Name as it appears on card" />
                            </div>
                            <div className="payment-campo">
                                <label>Card Number</label>
                                <input type="text" placeholder="0000 0000 0000 0000" />
                            </div>
                            <div className="payment-campo-row">
                                <div className="payment-campo">
                                    <label>Expiry Date</label>
                                    <input type="text" placeholder="MM/YY" />
                                </div>
                                <div className="payment-campo">
                                    <label>CVV</label>
                                    <input type="text" placeholder="•••" />
                                </div>
                            </div>
                            <div className="payment-campo">
                                <label>Billing Address</label>
                                <input type="text" placeholder="Same as shipping" />
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'mercadopago' && (
                        <div className="payment-alternative">
                            <p>Serás redirigido a MercadoPago / PayPal para completar el pago de forma segura.</p>
                        </div>
                    )}

                    {paymentMethod === 'transfer' && (
                        <div className="payment-alternative">
                            <p>CBU: 0000003100012345678901</p>
                            <p>Alias: BIGBOX.PAGOS</p>
                            <p>Una vez acreditada la transferencia recibirás la confirmación por email.</p>
                        </div>
                    )}

                    <div className="payment-security">
                        <span>🔒 SSL Encrypted</span>
                        <span>🛡 Secure Payment</span>
                        <span>✅ 100% Satisfaction</span>
                    </div>
                </div>

                {/* DERECHA */}
                <div className="payment-right">
                    <h3>Order Summary</h3>
                    {cartItems.map((item) => (
                        <div key={item.id} className="pay-summary-row">
                            <div className="pay-summary-item">
                                <img src={item.image} alt={item.name} />
                                <div>
                                    <strong>{item.name}</strong>
                                    <p>${item.price}.00</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="pay-row">
                        <span>Subtotal</span>
                        <span>${subtotal}.00</span>
                    </div>
                    <div className="pay-row">
                        <span>Service Fee</span>
                        <span className="free">Free</span>
                    </div>
                    <div className="pay-row">
                        <span>Tax</span>
                        <span>$0.00</span>
                    </div>
                    <div className="pay-total">
                        <span>Total</span>
                        <span>${subtotal}.00</span>
                    </div>
                    <button
                        className="btn-confirm-pay"
                        onClick={() => navigate('/checkout/confirmation')}
                    >
                        Confirm & Pay ${subtotal}.00 →
                    </button>
                    <p className="pay-terms">
                        By clicking "Confirm & Pay" you agree to BigBox Terms of Service and Privacy Policy.
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Payment