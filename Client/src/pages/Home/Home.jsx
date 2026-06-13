import "./Home.css";
import BoxCard from "../../components/BoxCard/BoxCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";

const getIconForCategory = (description = "", name = "") => {
  const s = `${description} ${name}`.toLowerCase();
  if (
    s.includes("gastron") ||
    s.includes("culinari") ||
    s.includes("comida") ||
    s.includes("restaur")
  )
    return "🍽️";
  if (
    s.includes("aventura") ||
    s.includes("trekk") ||
    s.includes("outdoor") ||
    s.includes("deport")
  )
    return "🧭";
  if (
    s.includes("entreteni") ||
    s.includes("teatro") ||
    s.includes("cine") ||
    s.includes("espect")
  )
    return "🎭";
  if (
    s.includes("estad") ||
    s.includes("hotel") ||
    s.includes("alojam") ||
    s.includes("hospedaj")
  )
    return "🏨";
  if (
    s.includes("relax") ||
    s.includes("spa") ||
    s.includes("bienestar") ||
    s.includes("masaje")
  )
    return "💆";
  if (s.includes("viaje") || s.includes("tour") || s.includes("turismo"))
    return "✈️";
  if (
    s.includes("música") ||
    s.includes("musica") ||
    s.includes("concierto") ||
    s.includes("recital")
  )
    return "🎵";
  if (
    s.includes("arte") ||
    s.includes("museo") ||
    s.includes("cultura") ||
    s.includes("exposic")
  )
    return "🎨";
  if (s.includes("vino") || s.includes("bodega") || s.includes("cerveza"))
    return "🍷";
  if (
    s.includes("natura") ||
    s.includes("eco") ||
    s.includes("campo") ||
    s.includes("parque")
  )
    return "🌿";
  if (s.includes("famil") || s.includes("niño") || s.includes("kids"))
    return "👨‍👩‍👧";
  if (s.includes("romántic") || s.includes("romantic") || s.includes("pareja"))
    return "❤️";
  return "✨";
};

function Home() {
  const navigate = useNavigate();

  // Estados para Categorías
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [errorCats, setErrorCats] = useState(null);

  // Estados para Cajas (Boxes)
  const [boxes, setBoxes] = useState([]);
  const [loadingBoxes, setLoadingBoxes] = useState(true);
  const [errorBoxes, setErrorBoxes] = useState(null);

  // === EFFECT 1: CARGAR CATEGORÍAS ===
  useEffect(() => {
    api
      .get("/api/categories")
      .then((res) => {
        setCategories(
          res.data.map((cat) => ({
            ...cat,
            icon: getIconForCategory(cat.description, cat.name),
          })),
        );
        setLoadingCats(false);
      })
      .catch((err) => {
        console.error("Error al cargar categorías:", err);
        setErrorCats("No se pudieron cargar las categorías.");
        setLoadingCats(false);
      });
  }, []);

  // === EFFECT 2: CARGAR CAJAS ===
  useEffect(() => {
    api
      .get("/api/boxes")
      .then((res) => {
        const data = res.data;
        const adaptedBoxes = data.map((box) => {
          // Extraemos la URL de la imagen de forma ultra segura resolviendo variaciones

          const urlDetectada =
            box.images && box.images.length > 0
              ? `data:image/png;base64,  ${box.images[0].base64Image}`
              : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400";

          return {
            id: box.id,
            name: box.name,
            description: box.description,
            price: box.price,
            stock: box.stock,
            category: box.category,
            // Multi-fallback de propiedades de imagen para blindar el componente BoxCard
            image: urlDetectada,
            imageUrl: urlDetectada,
            images: box.images || [],
          };
        });

        setBoxes(adaptedBoxes);
        setLoadingBoxes(false);
      })
      .catch((err) => {
        console.error("Error al cargar cajas:", err);
        setErrorBoxes(err.message);
        setLoadingBoxes(false);
      });
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/explore?category=${categoryId}`);
  };

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
        {loadingCats && <p className="loading-text">Cargando categorías...</p>}
        {errorCats && <p className="error-text">{errorCats}</p>}
        {!loadingCats && !errorCats && (
          <div className="categories-carousel">
            <div className="categories-track">
              {[...categories, ...categories].map((cat, i) => (
                <div
                  key={`${cat.id}-${i}`}
                  className="category-item"
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span>{cat.name || cat.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CAJAS */}
      <section className="boxes-section">
        <h2>Nuestras Experiencias</h2>
        <div className="boxes-grid">
          {loadingBoxes && (
            <div className="loading">Cargando experiencias...</div>
          )}
          {errorBoxes && <div className="error-message">{errorBoxes}</div>}

          {!loadingBoxes &&
            !errorBoxes &&
            (boxes.length > 0 ? (
              boxes.map((box) => <BoxCard key={box.id} box={box} />)
            ) : (
              <p>No hay experiencias disponibles en este momento.</p>
            ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
