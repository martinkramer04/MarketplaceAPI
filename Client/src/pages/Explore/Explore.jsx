import { useState, useEffect } from "react";
import "./explore.css";
import { Link, useSearchParams } from "react-router-dom";

export default function Explore() {
  const [searchParams] = useSearchParams();

  // ── Estados de categorías ──────────────────────────────
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // ── Estados de Cajas (Boxes) ───────────────────────────
  const [boxes, setBoxes] = useState([]);
  const [loadingBoxes, setLoadingBoxes] = useState(true);
  const [errorBoxes, setErrorBoxes] = useState(null);

  // ── Filtros ────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");

  // ── Fetch categorías ───────────────────────────────────
  useEffect(() => {
    fetch('http://localhost:4002/api/categories')
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setLoadingCats(false);

        const categoryParam = searchParams.get("category");
        const existe = data.some(c => c.id == categoryParam);
        if (categoryParam && existe) {
          setSelectedCategory(categoryParam);
        }
      })
      .catch(err => {
        console.error('Error al cargar categorías:', err);
        setLoadingCats(false);
      });
  }, [searchParams]);

  // ── Fetch Cajas (Boxes) desde el Backend ────────────────
  useEffect(() => {
    fetch('http://localhost:4002/api/boxes') // 👈 Ajustá la ruta según tu BoxController
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}. Revisá los permisos en tu SecurityConfig.`);
        return res.json();
      })
      .then(data => {
        setBoxes(data);
        setLoadingBoxes(false);
        setErrorBoxes(null);
      })
      .catch(err => {
        console.error('Error al cargar las cajas:', err);
        setErrorBoxes('No se pudieron cargar las cajas de experiencias.');
        setLoadingBoxes(false);
      });
  }, []);

  // ── Helpers ────────────────────────────────────────────
  const formatPrice = (value) => "$ " + (value ? value.toLocaleString("es-AR") : "0");

  const clearFilters = () => setSelectedCategory(null);

  // ── Filtrado y ordenamiento según tu BoxDto ────────────
  const filteredBoxes = boxes
    .filter(box => {
      if (!selectedCategory) return true;
      // 💡 Accedemos al ID del objeto category anidado que nos manda tu BoxDto
      return box.category && box.category.id == selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === "priceAsc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "priceDesc") return (b.price || 0) - (a.price || 0);
      return 0; // Removí ratingDesc porque tu BoxDto no lo incluye en sus atributos actuales
    });

  return (
    <main className="explore-page">

      {/* SIDEBAR */}
      <aside className="explore-sidebar">
        <div className="filter-header">
          <strong>Filtrar por:</strong>
          <button onClick={clearFilters}>Limpiar filtros</button>
        </div>

        {selectedCategory && (
          <div className="filter-chip">
            <span>
              {categories.find(c => c.id == selectedCategory)?.name}
            </span>
            <button onClick={clearFilters}>×</button>
          </div>
        )}

        <div className="category-title">Categorías</div>

        <div className="categories-list">
          {loadingCats && <p>Cargando categorías...</p>}
          {!loadingCats && categories.map(category => (
            <label className="category-item" key={category.id}>
              <span className="category-left">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory == category.id}
                  onChange={() => setSelectedCategory(category.id)}
                />
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </aside>

      {/* CONTENIDO */}
      <section className="explore-content">
        <div className="explore-topbar">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="relevance">Ordenar por Más relevantes</option>
            <option value="priceAsc">Menor precio</option>
            <option value="priceDesc">Mayor precio</option>
          </select>
        </div>

        <div className="products-grid">
          {loadingBoxes && <p>Cargando cajas de experiencias...</p>}
          {errorBoxes && <p className="error-msg">{errorBoxes}</p>}

          {!loadingBoxes && !errorBoxes && filteredBoxes.map((box, index) => {
            // 💡 Tomamos la primera imagen de la lista de ImageDto si existe, o ponemos un fallback
            const portadaUrl = box.images && box.images.length > 0
              ? box.images[0].image
              : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";

            // 💡 Contamos las opciones de la caja según el tamaño de la lista de ProductDto
            const cantidadOpciones = box.products ? box.products.length : 0;

            return (
              <Link
                to={`/box/${box.id}`}
                className="product-card-link"
                key={box.id || index}
              >
                <article className="product-card">
                  <div className="product-image-container">
                    <img src={portadaUrl} alt={box.name} />
                    <div className="product-image-title">
                      Box <br /> {box.name}
                    </div>
                  </div>

                  <div className="product-body">
                    <div className="product-title-row">
                      <h3>{box.name}</h3>
                    </div>

                    <p className="product-description">{box.description}</p>

                    <p className="product-info">♡ Contiene {cantidadOpciones} opciones</p>
                    <p className="product-info">♧ Stock disponible: {box.stock || 0}</p>

                    <div className="product-price">
                      {formatPrice(box.price)}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}

          {!loadingBoxes && !errorBoxes && filteredBoxes.length === 0 && (
            <p className="no-results">No hay cajas disponibles para esta categoría.</p>
          )}
        </div>
      </section>

    </main>
  );
}