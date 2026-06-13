import './Payment.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../Context/useCart'
import Stepper from '../../../components/Stepper/Stepper'
import api from '../../../api/axiosConfig'

function Payment() {
    const navigate = useNavigate()
    const { cartItems, clearCart } = useCart()
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

    const handleConfirmPayment = () => {
        setError(null)
        setLoading(true)

        const orderBody = {
            discountCode: null,
            paymentMethodId: 1,
            items: cartItems.map(item => ({
                boxId: item.id,
                quantity: item.quantity
            }))
        }

        api.post('/api/orders', orderBody)
            .then(res => {
                setLoading(false)
                clearCart()
                navigate('/checkout/confirmation', { state: { order: res.data } })
            })
            .catch(err => {
                console.error('Error al crear la orden:', err)
                setError('No se pudo procesar el pago. Intentá de nuevo.')
                setLoading(false)
            })
    }

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
                            💳 Tarjeta de crédito/débito
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
                            🏦 Transferencia Bancaria
                        </div>
                    </div>

                    {paymentMethod === 'card' && (
                        <div className="payment-form">
                            <div className="payment-campo">
                                <label>Nombre del titular</label>
                                <input type="text" placeholder="Mismo nombre que el que se encuentra en la tarjeta" />
                            </div>
                            <div className="payment-campo">
                                <label>Número de la tarjeta</label>
                                <input type="text" placeholder="0000 0000 0000 0000" />
                            </div>
                            <div className="payment-campo-row">
                                <div className="payment-campo">
                                    <label>Fecha de vencimiento</label>
                                    <input type="text" placeholder="MM/AA" />
                                </div>
                                <div className="payment-campo">
                                    <label>CVV</label>
                                    <input type="text" placeholder="•••" />
                                </div>
                            </div>
                            <div className="payment-campo">
                                <label>Dirección</label>
                                <input type="text" placeholder="Mismo que el envío" />
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

                    {error && (
                        <div className="payment-error">
                            {error}
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
                        <span>Tarifa de servicio</span>
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
                        onClick={handleConfirmPayment}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : `Confirmar y pagar $${subtotal}.00 →`}
                    </button>
                    <p className="pay-terms">
                        Al hacer clic en "Confirmar y pagar", aceptás los Términos de servicio y la Política de privacidad de BigBox.
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Payment