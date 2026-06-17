import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/useCart";
import { useToast } from "../../Context/ToastContext";
function Cart() {
  const navigate = useNavigate();
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const toast = useToast();
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
                    {/* 🟢 Toast informativo al disminuir cantidad */}
                    <button
                      className="qty-btn"
                      onClick={() => {
                        decreaseQuantity(item.id);
                        toast.info(`Se redujo la cantidad de "${item.name}".`);
                      }}
                    >
                      -
                    </button>

                    <span className="qty-value">{item.quantity}</span>

                    {/* 🟢 Toast de éxito al aumentar cantidad */}
                    <button
                      className="qty-btn"
                      onClick={() => {
                        addToCart(item);
                        toast.success(`Se agregó otro/a "${item.name}".`);
                      }}
                    >
                      +
                    </button>

                    {/* 🟢 REQUERIDO: Toast de error/alerta al eliminar un producto específico */}
                    <button
                      className="remove-btn"
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.error(`"${item.name}" fue eliminado del carrito.`);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* 🟢 REQUERIDO: Toast de error/alerta al vaciar por completo el carrito */}
            <button
              className="clear-cart-btn"
              onClick={() => {
                clearCart();
                toast.error("Se vació el carrito por completo.");
              }}
            >
              Vaciar carrito
            </button>
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