import "./Cart.css";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/useCart";
import { useToast } from "../../Context/ToastContext";
import OrderPanel from "../../components/OrderPanel/OrderPanel";
import { useCheckoutConfig } from "../../hooks/useCheckoutConfig";

function getItemImage(item) {
  return item.images?.[0]?.url ?? item.image ?? null;
}

function Cart() {
  const navigate = useNavigate();
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const toast = useToast();
  const { config } = useCheckoutConfig();

  const [selectedExtras, setSelectedExtras] = useState(new Set());

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 1), 0),
    [cartItems]
  );

  const shippingRow = useMemo(() => {
    const { shipping } = config;
    const isFree =
      shipping.free ||
      (shipping.freeThreshold !== null && subtotal >= shipping.freeThreshold);
    return isFree
      ? { label: shipping.label, value: 0, free: true }
      : { label: shipping.label, value: shipping.price };
  }, [config, subtotal]);

  const extraRows = useMemo(() => {
    const rows = [shippingRow];
    config.extras
      .filter((e) => e.optional && selectedExtras.has(e.id))
      .forEach((e) => rows.push({ label: e.label, value: e.price }));
    return rows;
  }, [shippingRow, config.extras, selectedExtras]);

  const toggleExtra = (id) => {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const { freeThreshold, free: alwaysFree } = config.shipping;
  const shippingProgress =
    !alwaysFree && freeThreshold
      ? Math.min((subtotal / freeThreshold) * 100, 100)
      : null;
  const remainingForFree =
    shippingProgress !== null ? Math.max(freeThreshold - subtotal, 0) : null;

  const optionalExtras = config.extras.filter((e) => e.optional);

  return (
    <div className="cart">
      <div className="cart-left">
        <h1>Carrito</h1>
        <span className="cart-count">
          {cartItems.length} {cartItems.length === 1 ? "item seleccionado" : "items seleccionados"}
        </span>

        {shippingProgress !== null && (
          <div className="shipping-progress">
            {remainingForFree > 0 ? (
              <p>
                Te faltan <strong>${remainingForFree.toFixed(2)}</strong> para obtener{" "}
                <strong>envío gratis</strong>
              </p>
            ) : (
              <p className="shipping-unlocked">¡Envío gratis desbloqueado!</p>
            )}
            <div className="shipping-bar">
              <div
                className="shipping-bar-fill"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

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
                        toast.error(`"${item.name}" fue eliminado del carrito.`);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {optionalExtras.length > 0 && (
              <div className="checkout-extras">
                <h3>Opciones adicionales</h3>
                {optionalExtras.map((extra) => (
                  <label
                    key={extra.id}
                    className={`extra-card ${selectedExtras.has(extra.id) ? "extra-card--selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras.has(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                    />
                    <div className="extra-card-info">
                      <span className="extra-card-label">{extra.label}</span>
                      {extra.description && (
                        <span className="extra-card-desc">{extra.description}</span>
                      )}
                    </div>
                    <span className="extra-card-price">
                      +${extra.price.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            )}

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
        extraRows={extraRows}
        footer={
          <button
            className="btn-checkout"
            onClick={() => navigate("/checkout/order-summary")}
          >
            Confirmar carrito / Proceder al checkout
          </button>
        }
      />
    </div>
  );
}

export default Cart;
