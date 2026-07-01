import "./Cart.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "../../Context/useCart";
import { useToast } from "../../Context/ToastContext";
import OrderPanel from "../../components/OrderPanel/OrderPanel";
import { validateCart } from "../../redux/boxSlice";

function getItemImage(item) {
  return item.images?.[0]?.url ?? item.image ?? null;
}

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, updateQuantity, clearCart } = useCart();
  const toast = useToast();
  const { validating } = useSelector((state) => state.boxes);

  const [validationIssues, setValidationIssues] = useState({});

  const runCartValidation = async (items) => {
    try {
      const { results } = await dispatch(validateCart(items)).unwrap();
      const issues = {};
      results.forEach((r) => { issues[r.boxId] = r; });
      setValidationIssues(issues);
    } catch {
      toast.error("No se pudo validar el carrito. Intenta de nuevo.");
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      const items = cartItems.map((item) => ({ boxId: item.id, quantity: item.quantity }));
      runCartValidation(items);
    }
  }, []);

  const hasUnresolvedIssues = Object.values(validationIssues).some((issue) => {
    const cartItem = cartItems.find((item) => item.id === issue.boxId);
    if (!cartItem) return false;
    if (issue.action === "REMOVE") return true;
    if (issue.action === "UPDATE_QUANTITY") return cartItem.quantity > issue.availableStock;
    return false;
  });

  const getIssueMessage = (issue) => {
    if (issue.action === "REMOVE") {
      if (issue.reason === "NOT_FOUND") return "Este producto ya no existe. Eliminalo para continuar.";
      if (issue.reason === "UNAVAILABLE") return "Este producto no está disponible. Eliminalo para continuar.";
      return "Este producto está sin stock. Eliminalo para continuar.";
    }
    if (issue.action === "UPDATE_QUANTITY") {
      return `Solo hay ${issue.availableStock} unidad${issue.availableStock !== 1 ? "es" : ""} disponible${issue.availableStock !== 1 ? "s" : ""}. Ajusta la cantidad para continuar.`;
    }
    return null;
  };

  return (
    <div className="cart">
      <div className="cart-left">
        <h1>Carrito</h1>
        <span className="cart-count">
          {cartItems.length}{" "}
          {cartItems.length === 1 ? "item seleccionado" : "items seleccionados"}
        </span>

        {hasUnresolvedIssues && (
          <div className="cart-validation-banner">
            Algunos productos tienen problemas de disponibilidad. Revisalos antes de continuar.
          </div>
        )}

        {cartItems.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <>
            {cartItems.map((item) => {
              const issue = validationIssues[item.id];
              const hasIssue = issue && (
                issue.action === "REMOVE" ||
                (issue.action === "UPDATE_QUANTITY" && item.quantity > issue.availableStock)
              );
              const isAtMaxStock = issue?.availableStock != null && item.quantity >= issue.availableStock;

              return (
                <div key={item.id} className={`cart-item${hasIssue ? " cart-item--issue" : ""}`}>
                  {getItemImage(item) && (
                    <img src={getItemImage(item)} alt={item.name} />
                  )}
                  <div>
                    <h3>{item.name}</h3>
                    <p>$ {item.price}</p>
                    {hasIssue && (
                      <p className="cart-item-issue-msg">{getIssueMessage(issue)}</p>
                    )}
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
                        disabled={isAtMaxStock}
                      >
                        +
                      </button>
                      {isAtMaxStock && (
                        <span className="qty-max-label">Máx. disponible</span>
                      )}
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
              );
            })}

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
            disabled={cartItems.length === 0 || validating || hasUnresolvedIssues}
          >
            {validating ? "Validando carrito..." : "Confirmar carrito / Proceder al checkout"}
          </button>
        }
      />
    </div>
  );
}

export default Cart;
