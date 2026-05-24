import './Home.css'
import BoxCard from '../../components/BoxCard/BoxCard'

const boxes = [
    {
        id: 1,
        name: "Gourmet Escape",
        description: "The ultimate dining experience for food enthusiasts.",
        price: 149,
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400"
    },
    {
        id: 2,
        name: "Wellness Retreat",
        description: "Recharge with a selection of premium spa treatments and holistic therapies.",
        price: 199,
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400"
    },
    {
        id: 3,
        name: "Adrenaline Rush",
        description: "For the thrill-seekers. Choice of skydiving, racing, or bungee jumping.",
        price: 249,
        image: "https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=400"
    },
    {
        id: 4,
        name: "Family Fun",
        description: "Create lasting memories with theme park passes and interactive workshop days.",
        price: 129,
        image: "https://saposyprincesas.elmundo.es/assets/2024/09/Experiencias-imprescindibles-en-familia-Destacada.jpg"
    }
]

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