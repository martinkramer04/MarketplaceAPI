import "./Payment.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCart } from "../../../Context/useCart";
import Stepper from "../../../components/Stepper/Stepper";
import { createOrder } from "../../../redux/orderSlice";
import { useToast } from "../../../Context/ToastContext";
import OrderPanel from "../../../components/OrderPanel/OrderPanel";

function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, clearCart } = useCart();
  const { discount } = useSelector((state) => state.discount);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const [cardForm, setCardForm] = useState({
    holderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmPayment = (total) => {
    setError(null);

    if (paymentMethod === "card") {
      if (!cardForm.holderName.trim()) {
        toast.error("Por favor, ingresa el nombre del titular de la tarjeta.");
        return;
      }
      if (
        !cardForm.cardNumber.trim() ||
        cardForm.cardNumber.replace(/\s/g, "").length < 16
      ) {
        toast.error("Ingresa un numero de tarjeta valido (16 digitos).");
        return;
      }
      if (!cardForm.expiry.trim() || !cardForm.expiry.includes("/")) {
        toast.error("Ingresa la fecha de vencimiento en formato MM/AA.");
        return;
      }
      if (!cardForm.cvv.trim() || cardForm.cvv.length < 3) {
        toast.error("El codigo CVV debe tener al menos 3 digitos.");
        return;
      }
      if (!cardForm.address.trim()) {
        toast.error("Por favor, ingresa la direccion de facturacion.");
        return;
      }
    }

    setLoading(true);

    const orderBody = {
      discountCode: discount?.code ?? null,
      paymentMethodId:
        paymentMethod === "card" ? 1 : paymentMethod === "mercadopago" ? 2 : 3,
      items: cartItems.map((item) => ({
        boxId: item.id,
        quantity: item.quantity,
      })),
    };

    dispatch(createOrder(orderBody))
      .unwrap()
      .then((data) => {
        setLoading(false);
        clearCart();
        toast.success("Pago procesado con exito! Generando tu orden...");
        navigate("/checkout/confirmation", { state: { order: data } });
      })
      .catch((err) => {
        console.error("Error al crear la orden:", err);
        const errorMsg =
          err?.message ||
          err ||
          "No se pudo procesar el pago. Intenta de nuevo.";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
      });
  };

  return (
    <div className="payment">
      <Stepper currentStep={2} />

      <div className="payment-body">
        {/* IZQUIERDA */}
        <div className="payment-left">
          <div className="payment-methods">
            <div
              className={`payment-method ${paymentMethod === "card" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              Tarjeta de credito/debito
            </div>

            <div
              className={`payment-method ${paymentMethod === "transfer" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("transfer")}
            >
              Transferencia Bancaria
            </div>
          </div>

          {paymentMethod === "card" && (
            <div className="payment-form">
              <div className="payment-campo">
                <label>Nombre del titular</label>
                <input
                  type="text"
                  name="holderName"
                  value={cardForm.holderName}
                  onChange={handleInputChange}
                  placeholder="Nombre en la tarjeta"
                />
              </div>
              <div className="payment-campo">
                <label>Numero de la tarjeta</label>
                <input
                  type="text"
                  name="cardNumber"
                  maxLength="19"
                  value={cardForm.cardNumber}
                  onChange={handleInputChange}
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div className="payment-campo-row">
                <div className="payment-campo">
                  <label>Fecha de vencimiento</label>
                  <input
                    type="text"
                    name="expiry"
                    maxLength="5"
                    value={cardForm.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                  />
                </div>
                <div className="payment-campo">
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    maxLength="4"
                    value={cardForm.cvv}
                    onChange={handleInputChange}
                    placeholder="..."
                  />
                </div>
              </div>
              <div className="payment-campo">
                <label>Direccion</label>
                <input
                  type="text"
                  name="address"
                  value={cardForm.address}
                  onChange={handleInputChange}
                  placeholder="Mismo que el envio"
                />
              </div>
            </div>
          )}

          {paymentMethod === "mercadopago" && (
            <div className="payment-alternative">
              <p>
                Seras redirigido a MercadoPago / PayPal para completar el pago
                de forma segura.
              </p>
            </div>
          )}

          {paymentMethod === "transfer" && (
            <div className="payment-alternative">
              <p>CBU: 0000003100012345678901</p>
              <p>Alias: BOXIFY.PAGOS</p>
              <p>
                Una vez acreditada la transferencia recibiras la confirmacion
                por email.
              </p>
            </div>
          )}

          {error && <div className="payment-error">{error}</div>}
        </div>

        {/* DERECHA — panel compartido */}
        <OrderPanel
          items={cartItems}
          extraRows={[
            { label: "Tarifa de servicio", value: 0, free: true },
            { label: "Impuestos", value: 0 },
          ]}
          footer={({ total }) => (
            <>
              <button
                className="btn-confirm-pay"
                onClick={() => handleConfirmPayment(total)}
                disabled={loading}
              >
                {loading
                  ? "Procesando..."
                  : `Confirmar y pagar $${total.toFixed(2)}`}
              </button>
              <p className="pay-terms">
                Al confirmar aceptas los Terminos de servicio y la Politica de
                privacidad de Boxify.
              </p>
            </>
          )}
        />
      </div>
    </div>
  );
}

export default Payment;
