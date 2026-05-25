import "./Home.css";
import BoxCard from "../../components/BoxCard/BoxCard";
import boxes from "../../data/Boxes";
import { Link } from "react-router-dom";

const categories = [
  { label: "Gastronomy", icon: "🍽️", param: "gastronomy" },
  { label: "Adventure", icon: "🧭", param: "adventure" },
  { label: "Wellness", icon: "🧘", param: "wellness" },
  { label: "Stays", icon: "🏠", param: "stays" },
];

function Home() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find the perfect experience</h1>
          <p>
            Curated adventures, culinary journeys, and serene escapes designed
            for those who value memories over things.
          </p>
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
            <Link key={cat.label} to={`/explore?category=${cat.param}`}>
              <div className="category-item">
                <span className="category-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </div>
            </Link>
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
  );
}

export default Home;
