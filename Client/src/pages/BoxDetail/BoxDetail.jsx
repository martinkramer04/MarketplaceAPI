import "./BoxDetail.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCart } from "../../Context/useCart";
import { useToast } from "../../Context/ToastContext";
import { getBoxImageUrl } from "../../utils/boxUtils";
import { fetchBoxes } from "../../redux/boxSlice";
import { fetchReviewsByBox } from "../../redux/reviewSlice";

function StarRating({ value }) {
  return (
    <div className="bd-star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= value ? "bd-star-filled" : "bd-star-empty"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewAvatar({ firstname, lastname }) {
  const initials =
    `${firstname?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase();
  return <div className="bd-review-avatar">{initials}</div>;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function BoxReviews({ boxId }) {
  const dispatch = useDispatch();
  const { reviews, loading, status } = useSelector((state) => state.reviews);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchReviewsByBox(boxId));
    }
  }, [dispatch, boxId, status]);

  const published = reviews.filter((r) => r.status === "REVIEWED");

  const avgRating =
    published.length > 0
      ? published.reduce((sum, r) => sum + r.rating, 0) / published.length
      : 0;

  return (
    <div className="box-detail-reviews">
      <h2>Reseñas</h2>

      {loading ? (
        <p className="bd-reviews-empty">Cargando reseñas...</p>
      ) : published.length === 0 ? (
        <p className="bd-reviews-empty">
          Todavía no hay reseñas para esta caja.
        </p>
      ) : (
        <>
          <div className="bd-reviews-summary">
            <span className="bd-avg-number">{avgRating.toFixed(1)}</span>
            <div className="bd-summary-right">
              <StarRating value={Math.round(avgRating)} />
              <span className="bd-reviews-count">
                {published.length}{" "}
                {published.length === 1 ? "reseña" : "reseñas"}
              </span>
            </div>
          </div>

          <div className="bd-reviews-list">
            {published.map((review) => (
              <div key={review.id} className="bd-review-card">
                <div className="bd-review-header">
                  <ReviewAvatar
                    firstname={review.user?.firstname}
                    lastname={review.user?.lastname}
                  />
                  <div className="bd-review-meta">
                    <span className="bd-review-name">
                      {review.user?.firstname} {review.user?.lastname}
                    </span>
                    <span className="bd-review-date">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <StarRating value={review.rating} />
                </div>
                {review.comment && (
                  <p className="bd-review-comment">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BoxDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { addToCart } = useCart();
  const toast = useToast();

  const { items, loading, error, status } = useSelector((state) => state.boxes);
  const box = items.find((b) => String(b.id) === String(id));

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBoxes());
    }
  }, [dispatch, status]);

  if (loading || status === "idle")
    return <p className="not-found">Cargando...</p>;
  if (error) return <p className="not-found">{error}</p>;
  if (!box) return <p className="not-found">Box not found.</p>;

  return (
    <div className="box-detail">
      {/* COLUMNA IZQUIERDA */}
      <div className="box-detail-left">
        <img
          src={getBoxImageUrl(box)}
          alt={box.name}
          className="box-detail-image"
        />

        <div className="box-detail-about">
          <h2>About the {box.name}</h2>
          <p>{box.description}</p>
        </div>

        {box.products?.length > 0 && (
          <div className="box-detail-products">
            <h2>Contenido de la caja</h2>
            <ul>
              {box.products.map((p) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          </div>
        )}

        <BoxReviews boxId={id} />
      </div>

      {/* COLUMNA DERECHA */}
      <div className="box-detail-right">
        {box.category?.name && (
          <span className="box-detail-category">
            ● {box.category.name.toUpperCase()}
          </span>
        )}
        <h1 className="box-detail-name">{box.name}</h1>
        <p className="box-detail-price">
          ${box.price} <span>per box</span>
        </p>

        {box.stock > 0 && box.stock < 5 && (
          <span className="bd-stock-badge">¡Últimas disponibles!</span>
        )}

        <div className="box-detail-actions">
          <button
            className="btn-add-cart"
            disabled={box.stock === 0}
            onClick={() => {
              addToCart(box);
              toast.success(`¡"${box.name}" añadida al carrito con éxito!`);
            }}
          >
            {box.stock === 0 ? "Sin stock" : "Agregar caja al carrito"}
          </button>
          <div className="box-detail-shipping">
            ✓ Envío digital gratuito o envío en caja de regalo premium
            disponible al finalizar la compra.
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoxDetail;
