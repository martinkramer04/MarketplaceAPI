import "./Home.css";
import BoxCard from "../../components/BoxCard/BoxCard";
import boxes from "../../data/Boxes";
import { Link } from "react-router-dom";

const categories = [
  { label: "Gastronomia", icon: "🍽️", id: 2 },
  { label: "Aventura", icon: "🧭", id: 5 },
  { label: "Bienestar", icon: "🧘", id: 3 },
  { label: "Estadias", icon: "🏠", id: 6 },
];

function Home() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Encontrá la experiencia perfecta</h1>
          <p>
            Experiencias, viajes culinarios y escapes diseñados para quienes
            valoran los recuerdos por sobre las cosas.
          </p>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="categories">
        <h2>Descubrí nuestras experiencias</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link key={cat.label} to={`/explore?category=${cat.id}`}>
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
        <h2>Nuestras Experiencias</h2>
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
