import './BoxDetail.css'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import boxes from '../../data/boxes'

function BoxDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const box = boxes.find((b) => b.id === parseInt(id))

    if (!box) {
        return <p className="not-found">Box not found.</p>
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
                <span className="box-detail-category">● PREMIUM SELECTION</span>
                <h1 className="box-detail-name">{box.name}</h1>
                <p className="box-detail-price">${box.price} <span>per box</span></p>

                <div className="box-detail-actions">
                    <button className="btn-add-cart" onClick={() => navigate('/cart')}>
                        Add Box to Cart
                    </button>
                    <button className="btn-wishlist">
                        ♡ Add to wishlist
                    </button>
                    <div className="box-detail-shipping">
                        ✓ Free digital delivery or premium gift box shipping available at checkout
                    </div>
                </div>
            </div>

        </div>
    )
}

export default BoxDetail