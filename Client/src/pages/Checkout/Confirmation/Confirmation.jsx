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
                <h1>¡Tu regalo está en camino!</h1>
                <p className="confirmation-sub">

                    Le hemos enviado un correo electrónico de confirmación con todos los detalles de su regalo.
                </p>

                {cartItems.map((item) => (
                    <div key={item.id} className="confirmation-card">
                        <img src={item.image} alt={item.name} />
                        <div className="confirmation-card-info">
                            <span className="confirmation-badge">Regalo Digital Listo!</span>
                            <h2>{item.name}</h2>
                            <div className="confirmation-meta">
                                <span>📅 Valido por 24 meses</span>
                                <span>👥 Para 2 personas</span>
                            </div>
                            <div className="confirmation-voucher">
                                <span>VOUCHER</span>
                                <strong>{voucherCode}</strong>
                            </div>
                        </div>
                    </div>
                ))}

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