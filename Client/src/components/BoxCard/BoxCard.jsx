import "./BoxCard.css";
import { useNavigate } from "react-router-dom";
import { getBoxImageUrl } from "../../utils/boxUtils";

function BoxCard({ box }) {
  const navigate = useNavigate();

  return (
    <div className="box-card" onClick={() => navigate(`/box/${box.id}`)}>
      <div className="box-card-image">
        <img src={getBoxImageUrl(box)} alt={box.name} />
      </div>
      <div className="box-card-body">
        <h3 className="box-card-name">{box.name}</h3>
        <p className="box-card-description">{box.description}</p>
        {box.stock < 5 && (
          <span className="box-card-stock-badge">¡Últimas disponibles!</span>
        )}
        <div className="box-card-footer">
          <span className="box-card-price">${box.price}</span>
        </div>
      </div>
    </div>
  );
}

export default BoxCard;
