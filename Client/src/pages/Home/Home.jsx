import "./Home.css";
import BoxCard from "../../components/BoxCard/BoxCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

// Íconos y orden de las 4 categorías principales del Home
const categoriasPrincipales = [
  { name: 'Experiencias Gastronómicas', icon: '🍽️' },
  { name: 'Aventura', icon: '🧭' },
  { name: 'Entretenimiento', icon: '🎭' },
  { name: 'Estadías', icon: '🏨' },
];

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
    api.get('/api/categories')
      .then(res => {
        const filtradas = categoriasPrincipales
          .map(principal => {
            const encontrada = res.data.find(cat => cat.name === principal.name);
            return encontrada ? { ...encontrada, icon: principal.icon } : null;
          })
          .filter(cat => cat !== null);

        setCategories(filtradas);
        setLoadingCats(false);
      })
      .catch(err => {
        console.error('Error al cargar categorías:', err);
        setErrorCats('No se pudieron cargar las categorías.');
        setLoadingCats(false);
      });
  }, []);

  // === EFFECT 2: CARGAR CAJAS ===
  useEffect(() => {
    api.get('/api/boxes')
      .then((res) => {
        const data = res.data;
        const adaptedBoxes = data.map((box) => {
          // Extraemos la URL de la imagen de forma ultra segura resolviendo variaciones
          const primeraImagen = box.images && box.images.length > 0 ? box.images[0] : null;
          const urlDetectada = primeraImagen
            ? (primeraImagen.image || primeraImagen.url || primeraImagen.imageUrl)
            : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400';

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
            images: box.images || []
          };
        });

        setBoxes(adaptedBoxes);
        setLoadingBoxes(false);
      })
      .catch((err) => {
        console.error('Error al cargar cajas:', err);
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
        <div className="categories-grid">
          {loadingCats && <p className="loading-text">Cargando categorías...</p>}
          {errorCats && <p className="error-text">{errorCats}</p>}

          {!loadingCats && !errorCats && categories.map((cat) => (
            <div
              key={cat.id}
              className="category-item"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CAJAS */}
      <section className="boxes-section">
        <h2>Nuestras Experiencias</h2>
        <div className="boxes-grid">
          {loadingBoxes && <div className="loading">Cargando experiencias...</div>}
          {errorBoxes && <div className="error-message">{errorBoxes}</div>}

          {!loadingBoxes && !errorBoxes && (
            boxes.length > 0 ? (
              boxes.map((box) => (
                <BoxCard key={box.id} box={box} />
              ))
            ) : (
              <p>No hay experiencias disponibles en este momento.</p>
            )
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;