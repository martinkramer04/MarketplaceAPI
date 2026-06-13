import './Confirmation.css'
import { useNavigate, useLocation } from 'react-router-dom'
import Stepper from '../../../components/Stepper/Stepper'

function Confirmation() {
    const navigate = useNavigate()
    const location = useLocation()

    // Recibimos la orden que creó el backend desde Payment via navigate state
    const order = location.state?.order

    const handleContinue = () => {
        navigate('/')
    }

    return (
        <div className="confirmation">

            <Stepper currentStep={3} />

            <div className="confirmation-body">

                <div className="confirmation-icon">✓</div>
                <h1>¡Tu regalo está en camino!</h1>
                <p className="confirmation-sub">
                    Te enviamos un email de confirmación con todos los detalles de tu compra.
                </p>

                {/* Mostramos cada item de la orden */}
                {order?.orderDetails?.map((detail, index) => (
                    <div key={index} className="confirmation-card">
                        {/* Si la caja tiene imagen la mostramos */}
                        {detail.box?.images?.[0]?.base64Image && (
                            <img
                                src={detail.box.images[0].base64Image}
                                alt={detail.boxName}
                            />
                        )}
                        <div className="confirmation-card-info">
                            <span className="confirmation-badge">Regalo Digital Listo!</span>
                            <h2>{detail.boxName}</h2>
                            <div className="confirmation-meta">
                                <span>📦 Cantidad: {detail.quantity}</span>
                                <span>💰 ${detail.subtotal}.00</span>
                            </div>
                            <div className="confirmation-voucher">
                                <span>NÚMERO DE ORDEN</span>
                                <strong>#{order.id}</strong>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Si no hay order (accedió directamente a la URL) */}
                {!order && (
                    <div className="confirmation-card">
                        <div className="confirmation-card-info">
                            <h2>Compra realizada con éxito</h2>
                            <p>Podés ver tus pedidos en tu perfil.</p>
                        </div>
                    </div>
                )}

                <div className="confirmation-order-total">
                    <span>Total pagado</span>
                    <strong>${order?.totalAmount}.00</strong>
                </div>

                <div className="confirmation-actions">
                    <button className="btn-orders" onClick={() => navigate('/perfil')}>
                        Ver Mis Pedidos
                    </button>
                    <button className="btn-continue-shopping" onClick={handleContinue}>
                        Continuar Comprando
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Confirmation