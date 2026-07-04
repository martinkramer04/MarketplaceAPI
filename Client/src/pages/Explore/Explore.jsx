import { useState, useEffect, useMemo } from "react";
import "./explore.css";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoxesAvailable } from "../../redux/boxSlice";
import { fetchCategories } from "../../redux/categorySlice";
import BoxCard from "../../components/BoxCard/BoxCard";

export default function Explore() {
  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");

  const dispatch = useDispatch();
  const {
    items,
    error,
    loading,
    status: boxesStatus,
  } = useSelector((state) => state.boxes);
  const {
    items: categories,
    loading: loadingCats,
    status: categoriesStatus,
  } = useSelector((state) => state.categories);

  useEffect(() => {
    if (categoriesStatus === "idle") dispatch(fetchCategories());
    if (categoriesStatus === "idle") dispatch(fetchBoxesAvailable());
  }, [dispatch, categoriesStatus, boxesStatus]);

  const categoryFromUrl = useMemo(() => {
    const param = searchParams.get("category");
    return categories.some((c) => c.id == param) ? param : null;
  }, [categories, searchParams]);

  const activeCategory = selectedCategory ?? categoryFromUrl;

  const clearFilters = () => setSelectedCategory(null);

  const filteredBoxes = items
    .filter((box) => {
      if (!activeCategory) return true;
      return box.category && box.category.id == activeCategory;
    })
    .sort((a, b) => {
      if (sortBy === "priceAsc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "priceDesc") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  return (
    <main className="explore-page">
      {/* SIDEBAR */}
      <aside className="explore-sidebar">
        <div className="filter-header">
          <strong>Filtrar por:</strong>
          <button onClick={clearFilters}>Limpiar filtros</button>
        </div>

        {activeCategory && (
          <div className="filter-chip">
            <span>{categories.find((c) => c.id == activeCategory)?.name}</span>
            <button onClick={clearFilters}>×</button>
          </div>
        )}

        <div className="category-title">Categorias</div>

        <div className="categories-list">
          {loadingCats && <p>Cargando categorias...</p>}
          {!loadingCats &&
            categories.map((category) => (
              <label className="category-item" key={category.id}>
                <span className="category-left">
                  <input
                    type="radio"
                    name="category"
                    checked={activeCategory == category.id}
                    onChange={() => setSelectedCategory(category.id)}
                  />
                  {category.name || category.description}
                </span>
              </label>
            ))}
        </div>
      </aside>

      {/* CONTENIDO */}
      <section className="explore-content">
        <div className="explore-topbar">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="relevance">Ordenar por Mas relevantes</option>
            <option value="priceAsc">Menor precio</option>
            <option value="priceDesc">Mayor precio</option>
          </select>
        </div>

        <div className="products-grid">
          {loading && <p>Cargando cajas de experiencias...</p>}
          {error && <p className="error-msg">{error}</p>}

          {!loading &&
            !error &&
            filteredBoxes.map((box) => <BoxCard key={box.id} box={box} />)}

          {!loading && !error && filteredBoxes.length === 0 && (
            <p className="no-results">
              No hay cajas disponibles para esta categoria.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
