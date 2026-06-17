import "./BoxDetail.css";
import { useParams } from "react-router-dom";
// import { useNavigate } from 'react-router-dom'
import boxes from "../../data/boxes";
import { useCart } from "../../Context/useCart";
import { useToast } from "../../Context/ToastContext";

function BoxDetail() {
  const { addToCart } = useCart();

  const { id } = useParams();
  // const navigate = useNavigate()
  const box = boxes.find((b) => b.id === parseInt(id));
  const toast = useToast();

  if (!box) {
    return <p className="not-found">Box not found.</p>;
  }

  return (
    <div className="box-detail">
      {/* COLUMNA IZQUIERDA */}
      <div className="box-detail-left">
        <img src={box.image} alt={box.name} className="box-detail-image" />

        <div className="box-detail-about">
          <h2>About the {box.name}</h2>
          <p>{box.longDescription}</p>
        </div>

        <div className="box-detail-reviews">
          <h2>Reviews & Rating</h2>
          <div className="box-detail-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-number">{box.rating}</span>
            <span className="rating-count">({box.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="box-detail-right">
        <span className="box-detail-category">● SELECCION PREMIUM</span>
        <h1 className="box-detail-name">{box.name}</h1>
        <p className="box-detail-price">
          ${box.price} <span>per box</span>
        </p>

        <div className="box-detail-actions">
          {/* 🟢 ACTUALIZADO: Ahora suma al carrito y dispara el Toast de éxito en simultáneo */}
          <button
            className="btn-add-cart"
            onClick={() => {
              addToCart(box);
              toast.success(`¡"${box.name}" añadida al carrito con éxito!`);
            }}
          >
            Agregar caja al carrito
          </button>
          <div className="box-detail-shipping">
            ✓ Envío digital gratuito o envío en caja de regalo premium disponible al finalizar la compra.
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoxDetail;
