import { useState } from 'react'
import './OrderSummary.css'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../Context/useCart'
import Stepper from '../../../components/Stepper/Stepper'
import OrderPanel from '../../../components/OrderPanel/OrderPanel'

function OrderSummary() {
    const navigate = useNavigate()
    const { cartItems } = useCart()
    const [delivery, setDelivery] = useState('digital')

    const deliveryFee = delivery === 'physical' ? 9.99 : 0

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

                    <div className="os-delivery">
                        <h3>Elige tu metodo de entrega</h3>
                        <div className="os-delivery-options">
                            <div
                                className={`os-delivery-option ${delivery === 'digital' ? 'selected' : ''}`}
                                onClick={() => setDelivery('digital')}
                            >
                                <span>Digital e-Box</span>
                                <div>
                                    <strong>Digital e-Box</strong>
                                    <p>Reciba su pedido al instante en su bandeja de entrada.</p>
                                </div>
                            </div>
                            <div
                                className={`os-delivery-option ${delivery === 'physical' ? 'selected' : ''}`}
                                onClick={() => setDelivery('physical')}
                            >
                                <span>Luxury Gift Box</span>
                                <div>
                                    <strong>Luxury Gift Box</strong>
                                    <p>Caja fisica premium a traves de FedEx. (+$9.99)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DERECHA — panel compartido */}
                <OrderPanel
                    items={cartItems}
                    extraRows={[
                        { label: 'Tarifa de entrega', value: deliveryFee, free: deliveryFee === 0 },
                    ]}
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
