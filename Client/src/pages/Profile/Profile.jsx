import "./Profile.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../../redux/userSlice";
import { fetchOrdersByUser } from "../../redux/orderSlice";
import { fetchReviewsByUser, createReview } from "../../redux/reviewSlice";
import { useToast } from "../../Context/ToastContext";
import api from "../../api/axiosConfig";

function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= value ? "star-filled" : "star-empty"}`}
          onClick={!readOnly ? () => onChange(star) : undefined}
          disabled={readOnly}
          aria-label={`${star} estrella${star !== 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ boxId, onReviewed }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const userId = useSelector((state) => state.user.data?.id);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Seleccioná una calificación de 1 a 5 estrellas.");
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(createReview({ boxId, rating, comment })).unwrap();
      if (userId) dispatch(fetchReviewsByUser(userId));
      toast.success("¡Reseña enviada con éxito!");
      onReviewed();
    } catch {
      toast.error("No se pudo enviar la reseña. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <p className="review-form-label">Tu calificación</p>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        className="review-textarea"
        placeholder="Contanos tu experiencia (opcional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <button
        className="btn-review-submit"
        type="submit"
        disabled={submitting || rating === 0}
      >
        {submitting ? "Enviando..." : "Enviar reseña"}
      </button>
    </form>
  );
}

function OrderBoxItem({ detail }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="order-box-item">
      <div className="order-box-header">
        <div className="order-box-info">
          <span className="order-box-name">{detail.boxName}</span>
          {detail.quantity && (
            <span className="order-box-qty">x{detail.quantity}</span>
          )}
        </div>
        {detail.pendingReview && !submitted && (
          <button
            className="btn-toggle-review"
            type="button"
            onClick={() => setShowForm((p) => !p)}
          >
            {showForm ? "Cancelar" : "★ Reseñar"}
          </button>
        )}
      </div>

      {submitted ? (
        <span className="review-badge-done">✓ Reseña enviada</span>
      ) : detail.pendingReview ? (
        showForm ? (
          <ReviewForm
            boxId={detail.box.id}
            onReviewed={() => {
              setShowForm(false);
              setSubmitted(true);
            }}
          />
        ) : (
          <span className="review-badge-pending">Reseña pendiente</span>
        )
      ) : null}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const pendingItems =
    order.orderDetails?.filter((d) => d.pendingReview).length ?? 0;

  return (
    <div className={`order-card ${expanded ? "order-card-expanded" : ""}`}>
      <button
        className="order-card-header"
        type="button"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="order-card-left">
          <div className="order-card-meta">
            <span className="order-id">#{order.id}</span>
            {pendingItems > 0 && (
              <span className="pending-review-badge">
                {pendingItems === 1
                  ? "1 reseña pendiente"
                  : `${pendingItems} reseñas pendientes`}
              </span>
            )}
          </div>
          <h3 className="order-card-title">
            {order.orderDetails?.[0]?.boxName || "Pedido"}
            {order.orderDetails?.length > 1 && (
              <span className="order-extra">
                {" "}
                +{order.orderDetails.length - 1} más
              </span>
            )}
          </h3>
        </div>
        <div className="order-card-right">
          <span
            className={`order-status ${
              order.status === "ACTIVE" ? "status-active" : "status-used"
            }`}
          >
            {order.status === "ACTIVE" ? "Activo" : "Canjeado"}
          </span>
          <span className="order-price">${order.totalAmount}.00</span>
          <span className="order-toggle-icon">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="order-card-body">
          {order.orderDetails?.map((detail, idx) => (
            <OrderBoxItem key={detail.id ?? idx} detail={detail} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ reviews, orders }) {
  const boxNameMap = {};
  orders.forEach((order) => {
    order.orderDetails?.forEach((detail) => {
      if (detail.boxId) boxNameMap[detail.boxId] = detail.boxName;
    });
  });

  if (reviews.length === 0) {
    return (
      <p className="perfil-no-orders">Todavía no hiciste ninguna reseña.</p>
    );
  }

  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-card-header">
            <span className="review-box-name">
              {review.boxName ||
                boxNameMap[review.box.id] ||
                `${review.box.name}`}
            </span>
            <StarRating value={review.rating} readOnly />
          </div>
          {review.comment && (
            <p className="review-card-comment">"{review.comment}"</p>
          )}
        </div>
      ))}
    </div>
  );
}

function Profile() {
  const dispatch = useDispatch();
  const toast = useToast();

  const user = useSelector((state) => state.user.data);
  const orders = useSelector((state) => state.orders.orders);
  const ordersLoading = useSelector((state) => state.orders.loading);
  const reviews = useSelector((state) => state.reviews.reviews);

  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser()).then((action) => {
      setPageLoading(false);
      const u = action.payload;
      if (!u) return;
      setForm({
        firstname: u.firstname || "",
        lastname: u.lastname || "",
        email: u.email || "",
        password: "",
        repeatPassword: "",
      });
      if (u.role === "USER") {
        dispatch(fetchOrdersByUser(u.id));
        dispatch(fetchReviewsByUser(u.id));
      }
    });
  }, [dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.repeatPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    setSaving(true);
    const payload = {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
    };
    if (form.password) payload.password = form.password;
    try {
      await api.put("/auth/me", payload);
      toast.success("Cambios guardados correctamente.");
      setForm((prev) => ({ ...prev, password: "", repeatPassword: "" }));
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error al guardar los cambios.",
      );
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (firstname, lastname) =>
    `${firstname?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase();

  if (pageLoading) return <p className="loading-msg">Cargando perfil...</p>;
  if (!user) return null;

  const pendingCount = orders.filter((o) =>
    o.orderDetails?.some((d) => d.pendingReview),
  ).length;
  const reviewedReviews = reviews.filter((r) => r.status === "REVIEWED");

  return (
    <div className="perfil">
      <div className="perfil-header">
        <div className="perfil-avatar">
          {getInitials(user.firstname, user.lastname)}
        </div>
        <div className="perfil-info">
          <h1>
            {user.firstname} {user.lastname}
          </h1>
          <p>{user.email}</p>
          <span className="perfil-since">
            {user.role === "ADMIN" && "👑 Administrador"}
            {user.role === "PROVIDER" && "🏢 Proveedor"}
            {user.role === "USER" && "👤 Usuario"}
          </span>
        </div>
      </div>

      <div
        className={`perfil-body ${user.role === "ADMIN" ? "perfil-body-admin" : ""}`}
      >
        {user.role !== "ADMIN" && (
          <section className="perfil-orders">
            <div className="perfil-orders-header">
              <h2>Historial</h2>
              <div className="tab-switcher">
                <button
                  className={`tab-btn ${activeTab === "orders" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  Pedidos
                  {pendingCount > 0 && (
                    <span className="tab-count">{pendingCount}</span>
                  )}
                </button>
                <button
                  className={`tab-btn ${activeTab === "reviews" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reseñas
                  {reviewedReviews.length > 0 && (
                    <span className="tab-count">{reviewedReviews.length}</span>
                  )}
                </button>
              </div>
            </div>

            {activeTab === "orders" && (
              <>
                {ordersLoading ? (
                  <p className="perfil-no-orders">Cargando pedidos...</p>
                ) : orders.length === 0 ? (
                  <p className="perfil-no-orders">
                    Todavía no tenés pedidos realizados.
                  </p>
                ) : (
                  orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </>
            )}

            {activeTab === "reviews" && (
              <ReviewsTab reviews={reviewedReviews} orders={orders} />
            )}
          </section>
        )}

        <section className="perfil-datos">
          <h2>Mis datos</h2>
          <form onSubmit={handleSubmit}>
            <div className="perfil-campo">
              <label>Nombre</label>
              <input
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="perfil-campo">
              <label>Apellido</label>
              <input
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="perfil-campo">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="perfil-campo">
              <label>Nueva contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Dejar en blanco para no cambiar"
              />
            </div>
            <div className="perfil-campo">
              <label>Repetir contraseña</label>
              <input
                type="password"
                name="repeatPassword"
                value={form.repeatPassword}
                onChange={handleChange}
                placeholder="Repetir nueva contraseña"
              />
            </div>
            <div className="perfil-campo">
              <label>Rol actual</label>
              <input type="text" value={user.role} disabled />
            </div>
            <button className="btn-guardar" type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Profile;
