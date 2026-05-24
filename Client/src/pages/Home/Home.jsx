import './Home.css'
import BoxCard from '../../components/BoxCard/BoxCard'
import boxes from '../../data/Boxes'


const categories = [
    { label: "Gastronomy", icon: "🍽️" },
    { label: "Adventure", icon: "🧭" },
    { label: "Wellness", icon: "🧘" },
    { label: "Stays", icon: "🏠" }
]

function Home() {
    return (
        <div className="home">

            {/* HERO */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Find the perfect experience</h1>
                    <p>Curated adventures, culinary journeys, and serene escapes designed for those who value memories over things.</p>
                    <div className="hero-search">
                        <input type="text" placeholder="What are you looking for?" />
                        <input type="text" placeholder="📍 Location" />
                        <button>Search</button>
                    </div>
                </div>
            </section>

            {/* CATEGORIAS */}
            <section className="categories">
                <h2>Explore by Interest</h2>
                <div className="categories-grid">
                    {categories.map((cat) => (
                        <div key={cat.label} className="category-item">
                            <span className="category-icon">{cat.icon}</span>
                            <span>{cat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CAJAS */}
            <section className="boxes-section">
                <h2>Our Experiences</h2>
                <div className="boxes-grid">
                    {boxes.map((box) => (
                        <BoxCard key={box.id} box={box} />
                    ))}
                </div>
            </section>

        </div>
    )
}

export default Home