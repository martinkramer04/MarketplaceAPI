import "./Home.css";
import BoxCard from "../../components/BoxCard/BoxCard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoxes } from "../../redux/boxSlice";
import { fetchCategories } from "../../redux/categorySlice";
import { getIconForCategory } from "../../utils/boxUtils";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    items: rawCategories,
    loading: loadingCats,
    error: errorCats,
    status: statusCats,
  } = useSelector((state) => state.categories);
  const {
    items: boxes,
    loading: loadingBoxes,
    error: errorBoxes,
    status: statusBoxes,
  } = useSelector((state) => state.boxes);

  const categories = rawCategories.map((cat) => ({
    ...cat,
    icon: getIconForCategory(cat.description, cat.name),
  }));

  useEffect(() => {
    if (statusCats === "idle") dispatch(fetchCategories());
    if (statusBoxes === "idle") dispatch(fetchBoxes());
  }, [dispatch, statusCats, statusBoxes]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/explore?category=${categoryId}`);
  };

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Encontra la experiencia perfecta</h1>
          <p>
            Experiencias, viajes culinarios y escapes diseñados para quienes
            valoran los recuerdos por sobre las cosas.
          </p>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="categories">
        <h2>Descubri nuestras experiencias</h2>
        {loadingCats && <p className="loading-text">Cargando categorias...</p>}
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
          {loadingBoxes && <div className="loading">Cargando experiencias...</div>}
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