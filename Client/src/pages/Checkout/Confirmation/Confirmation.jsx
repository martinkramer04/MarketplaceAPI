import './Confirmation.css'
import { useNavigate, useLocation } from 'react-router-dom'
import Stepper from '../../../components/Stepper/Stepper'
import OrderPanel from '../../../components/OrderPanel/OrderPanel'

function Confirmation() {
    const navigate = useNavigate()
    const location = useLocation()
    const order = location.state?.order

    const panelItems = (order?.orderDetails ?? []).map((d) => ({
        id: d.boxId,
        name: d.boxName,
        price: d.subtotal,
        quantity: 1,
        image: d.box?.images?.[0]?.url ?? null,
    }))

    return (
        <div className="confirmation">
            <Stepper currentStep={3} />

            <div className="confirmation-body">
                <div className="confirmation-icon">&#10003;</div>
                <h1>Tu regalo esta en camino!</h1>
                <p className="confirmation-sub">
                    Te enviamos un email de confirmacion con todos los detalles de tu compra.
                </p>

                {order ? (
                    <OrderPanel
                        items={panelItems}
                        totalOverride={order.totalAmount}
                        footer={
                            <div className="confirmation-actions">
                                <button className="btn-orders" onClick={() => navigate('/perfil')}>
                                    Ver Mis Pedidos
                                </button>
                                <button className="btn-continue-shopping" onClick={() => navigate('/')}>
                                    Continuar Comprando
                                </button>
                            </div>
                        }
                    />
                ) : (
                    <>
                        <div className="confirmation-card">
                            <div className="confirmation-card-info">
                                <h2>Compra realizada con exito</h2>
                                <p>Podes ver tus pedidos en tu perfil.</p>
                            </div>
                        </div>
                        <div className="confirmation-actions">
                            <button className="btn-orders" onClick={() => navigate('/perfil')}>
                                Ver Mis Pedidos
                            </button>
                            <button className="btn-continue-shopping" onClick={() => navigate('/')}>
                                Continuar Comprando
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Confirmation
