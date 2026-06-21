import "./BoxDetail.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "../../Context/useCart";
import { useToast } from "../../Context/ToastContext";
import { getBoxImageUrl } from "../../utils/boxUtils";

function BoxDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const toast = useToast();

  const { items, loading, error } = useSelector((state) => state.boxes);
  const box = items.find((b) => String(b.id) === String(id));

  if (loading) return <p className="not-found">Cargando...</p>;
  if (error) return <p className="not-found">{error}</p>;
  if (!box) return <p className="not-found">Box not found.</p>;

  return (
    <div className="box-detail">
      {/* COLUMNA IZQUIERDA */}
      <div className="box-detail-left">
        <img src={getBoxImageUrl(box)} alt={box.name} className="box-detail-image" />

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
