import './OrderSummary.css'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../Context/useCart'
import Stepper from '../../../components/Stepper/Stepper'
import OrderPanel from '../../../components/OrderPanel/OrderPanel'
import { getItemImageUrl } from '../../../utils/boxUtils'

function OrderSummary() {
    const navigate = useNavigate()
    const { cartItems } = useCart()

    return (
        <div className="order-summary">
            <Stepper currentStep={1} />
            <div className="order-summary-body">

                {/* IZQUIERDA */}
                <div className="order-summary-left">
                    {cartItems.map((item) => (
                        <div key={item.id} className="os-item">
                            <img src={getItemImageUrl(item)} alt={item.name} />
                            <div className="os-item-info">
                                <span className="os-item-badge">Mas vendido</span>
                                <h2>{item.name}</h2>
                                <p>{item.description}</p>
                                <div className="os-item-meta">
                                    <span>Valido 24 meses</span>
                                    <span>2 personas</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DERECHA — panel compartido */}
                <OrderPanel
                    items={cartItems}
                    showCouponInput
                    footer={
                        <button
                            className="btn-continue"
                            onClick={() => navigate('/checkout/payment')}
                        >
                            Continuar con el pago &rarr;
                        </button>
                    }
                />

            </div>
        </div>
    )
}

export default OrderSummary
