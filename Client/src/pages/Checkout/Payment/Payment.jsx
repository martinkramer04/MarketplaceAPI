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
                            💳 Tarjeta de credito/debito
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
                            🏦 Tranferencia Bancaria
                        </div>
                    </div>

                    {paymentMethod === 'card' && (
                        <div className="payment-form">
                            <div className="payment-campo">
                                <label>Nombre del titular</label>
                                <input type="text" placeholder="Mismo nombre que el que se encuentra en la tarjeta" />
                            </div>
                            <div className="payment-campo">
                                <label>Numero de la tarjeta</label>
                                <input type="text" placeholder="0000 0000 0000 0000" />
                            </div>
                            <div className="payment-campo-row">
                                <div className="payment-campo">
                                    <label>Expiry Date</label>
                                    <input type="text" placeholder="MM/AA" />
                                </div>
                                <div className="payment-campo">
                                    <label>CVV</label>
                                    <input type="text" placeholder="•••" />
                                </div>
                            </div>
                            <div className="payment-campo">
                                <label>Direccion</label>
                                <input type="text" placeholder="Mismo que el envio" />
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
                </div>

                {/* DERECHA */}
                <div className="payment-right">
                    <h3>Resumen del pedido</h3>
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
                        <span>
                            Tarifa de servicio</span>
                        <span className="free">Free</span>
                    </div>
                    <div className="pay-row">
                        <span>Impuestos</span>
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
                        Confirma y paga ${subtotal}.00 →
                    </button>
                    <p className="pay-terms">

                        Al hacer clic en "Confirmar y pagar", acepta los Términos de servicio y la Política de privacidad de BigBox.
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Payment