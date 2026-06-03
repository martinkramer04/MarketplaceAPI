import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/useCart";

function Cart() {
  const navigate = useNavigate();
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart">
      <div className="cart-left">
        <h1>Carrito</h1>
        <span className="cart-count">{cartItems.length} items seleccionados</span>

        {cartItems.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>$ {item.price}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <div className="cart-actions">
                    <button className="qty-btn" onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => addToCart(item)}>+</button>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
            <button className="clear-cart-btn" onClick={clearCart}>Vaciar carrito</button>
          </>
        )}
      </div>

      <div className="cart-right">
        <h2>Resumen del pedido</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${subtotal}.00</span>
        </div>
        <div className="summary-row">
          <span>Envío</span>
          <span className="free">GRATIS</span>
        </div>
        <div className="summary-row">
          <span>Envoltura de regalos</span>
          <span>$15.00</span>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <span>${subtotal + 15}.00</span>
        </div>
        <button className="btn-checkout" onClick={() => navigate('/checkout/order-summary')}>
          Confirmar carrito / Proceder al checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;