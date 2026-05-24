import './Cart.css'
import { useNavigate } from 'react-router-dom'

// Por ahora con datos hardcodeados, después conectamos el context
const cartItems = [
    {
        id: 1,
        name: "Gourmet Escape",
        description: "Premium dining experience",
        price: 149,
        qty: 1,
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400"
    },
    {
        id: 3,
        name: "Adrenaline Rush",
        description: "Skydiving and extreme sports",
        price: 249,
        qty: 1,
        image: "https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=400"
    }
]

function Cart() {
    const navigate = useNavigate()
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)

    return (
        <div className="cart">

            {/* LISTA DE ITEMS */}
            <div className="cart-left">
                <h1>My Cart</h1>
                <span className="cart-count">{cartItems.length} items selected</span>

                {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} />
                        <div className="cart-item-info">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                        </div>
                        <div className="cart-item-right">
                            <span className="cart-item-price">${item.price}</span>
                            <button className="btn-remove">🗑 Remove</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="cart-right">
                <h2>Order Summary</h2>

                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal}.00</span>
                </div>
                <div className="summary-row">
                    <span>Shipping</span>
                    <span className="free">FREE</span>
                </div>
                <div className="summary-row">
                    <span>Gift Wrapping</span>
                    <span>$15.00</span>
                </div>

                <div className="summary-total">
                    <span>Total</span>
                    <span>${subtotal + 15}.00</span>
                </div>

                <button className="btn-checkout" onClick={() => navigate('/checkout')}>
                    Confirm Cart / Proceed to Checkout
                </button>

                <div className="summary-promo">
                    <p>Promo Code</p>
                    <div className="promo-input">
                        <input type="text" placeholder="Enter code" />
                        <button>Apply</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Cart