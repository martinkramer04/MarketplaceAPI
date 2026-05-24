import './BoxCard.css'
import { useNavigate } from 'react-router-dom'

function BoxCard({ box }) {
    const navigate = useNavigate()

    return (
        <div className="box-card" onClick={() => navigate(`/box/${box.id}`)}>

            <div className="box-card-image">
                <img src={box.image} alt={box.name} />
            </div>

            <div className="box-card-body">
                <h3 className="box-card-name">{box.name}</h3>
                <p className="box-card-description">{box.description}</p>
                <div className="box-card-footer">
                    <span className="box-card-price">${box.price}</span>
                    <button className="box-card-btn" onClick={(e) => {
                        e.stopPropagation()
                    }}>+</button>
                </div>
            </div>

        </div>
    )
}

export default BoxCard