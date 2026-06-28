import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/useCart";
import { useToast } from "../../Context/ToastContext";
import OrderPanel from "../../components/OrderPanel/OrderPanel";

function getItemImage(item) {
  return item.images?.[0]?.url ?? item.image ?? null;
}

function Cart() {
  const navigate = useNavigate();
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, clearCart } =
    useCart();
  console.log(cartItems);
  const toast = useToast();

  return (
    <div className="cart">
      <div className="cart-left">
        <h1>Carrito</h1>
        <span className="cart-count">
          {cartItems.length}{" "}
          {cartItems.length === 1 ? "item seleccionado" : "items seleccionados"}
        </span>

        {cartItems.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                {getItemImage(item) && (
                  <img src={getItemImage(item)} alt={item.name} />
                )}
                <div>
                  <h3>{item.name}</h3>
                  <p>$ {item.price}</p>
                  <div className="cart-actions">
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
                    <button
                      className="qty-btn"
                      onClick={() => {
                        addToCart(item);
                        toast.success(`Se agregó otro/a "${item.name}".`);
                      }}
                    >
                      +
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.error(
                          `"${item.name}" fue eliminado del carrito.`,
                        );
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}

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

      <OrderPanel
        items={cartItems}
        footer={
          <button
            className="btn-checkout"
            onClick={() => navigate("/checkout/order-summary")}
            disabled={cartItems.length === 0}
          >
            Confirmar carrito / Proceder al checkout
          </button>
        }
      />
    </div>
  );
}

export default Cart;
