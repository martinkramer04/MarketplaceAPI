import { useState } from "react";
import "./explore.css";
import { Link } from "react-router-dom";

const categories = [
  { name: "Desayunos, Almuerzos y Tapeos", count: 11 },
  { name: "Experiencias Gastronómicas", count: 10 },
  { name: "Estar Bien", count: 9 },
  { name: "Ocasiones", count: 9 },
  { name: "Aventura", count: 7 },
  { name: "Estadías", count: 7 },
  { name: "Mix", count: 6 },
  { name: "Cursos y Talleres", count: 2 },
  { name: "Delivery y Take Away", count: 2 },
  { name: "Entretenimiento", count: 1 },
];

const products = [
  {
    title: "Grande Cuisine",
    category: "Experiencias Gastronómicas",
    rating: 4.7,
    options: 68,
    people: 2,
    price: 134000,
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80",
    description:
      "Esta Bigbox, para dos personas, ofrece la posibilidad de elegir una experiencia única.",
  },
  {
    title: "Experiencia Gourmet",
    category: "Experiencias Gastronómicas",
    rating: 4.7,
    options: 94,
    people: 2,
    price: 104000,
    image:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80",
    description:
      "Esta Bigbox ofrece la posibilidad de disfrutar una propuesta gastronómica premium.",
  },
  {
    title: "De Autor",
    category: "Experiencias Gastronómicas",
    rating: 4.9,
    options: 33,
    people: 2,
    price: 174000,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    description:
      "Regalá experiencias únicas con menús de autor especialmente seleccionados.",
  },
  {
    title: "Clásicos y Bodegones",
    category: "Experiencias Gastronómicas",
    rating: 4.5,
    options: 25,
    people: 2,
    price: 89000,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    description:
      "Esta Bigbox ofrece la posibilidad de elegir entre los mejores clásicos.",
  },
  {
    title: "Premiados",
    category: "Experiencias Gastronómicas",
    rating: 4.8,
    options: 22,
    people: 2,
    price: 219000,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
    description:
      "Regalá experiencias únicas en restaurantes reconocidos y premiados.",
  },
  {
    title: "Sabores del Mundo",
    category: "Experiencias Gastronómicas",
    rating: 4.6,
    options: 45,
    people: 2,
    price: 82000,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    description:
      "Descubrí propuestas gastronómicas inspiradas en distintas culturas.",
  },
  {
    title: "Brunch Especial",
    category: "Desayunos, Almuerzos y Tapeos",
    rating: 4.4,
    options: 18,
    people: 2,
    price: 65000,
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80",
    description:
      "Una experiencia ideal para disfrutar desayunos, brunchs y tapeos.",
  },
];

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState(
    "Experiencias Gastronómicas",
  );
  const [sortBy, setSortBy] = useState("relevance");

  const formatPrice = (value) => {
    return "$ " + value.toLocaleString("es-AR");
  };

  const clearFilters = () => {
    setSelectedCategory(null);
  };

  const filteredProducts = products
    .filter((product) => {
      if (!selectedCategory) return true;
      return product.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "ratingDesc") return b.rating - a.rating;
      return 0;
    });

  return (
    <main className="explore-page">
      <aside className="explore-sidebar">
        <div className="filter-header">
          <strong>Filtrar por:</strong>
          <button onClick={clearFilters}>Limpiar filtros</button>
        </div>

        {selectedCategory && (
          <div className="filter-chip">
            <span>{selectedCategory}</span>
            <button onClick={clearFilters}>×</button>
          </div>
        )}

        <div className="category-title">Categorías</div>

        <div className="categories-list">
          {categories.map((category) => (
            <label className="category-item" key={category.name}>
              <span className="category-left">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.name}
                  onChange={() => setSelectedCategory(category.name)}
                />
                {category.name}
              </span>

              <span className="category-count">{category.count}</span>
            </label>
          ))}
        </div>
      </aside>

      <section className="explore-content">
        <div className="explore-topbar">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="relevance">Ordenar por Más relevantes</option>
            <option value="priceAsc">Menor precio</option>
            <option value="priceDesc">Mayor precio</option>
            <option value="ratingDesc">Mejor rating</option>
          </select>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <Link to="/box/1" className="product-card-link" key={product.title}>
              <article className="product-card" key={product.title}>
                <div className="product-image-container">
                  <img src={product.image} alt={product.title} />
                  <button className="favorite-button">♡</button>
                  <div className="product-image-title">
                    Box <br /> {product.title}
                  </div>
                </div>

                <div className="product-body">
                  <div className="product-title-row">
                    <h3>{product.title}</h3>
                    <span className="product-rating">★ {product.rating}</span>
                  </div>

                  <p className="product-description">{product.description}</p>

                  <p className="product-info">
                    ♡ Contiene {product.options} opciones
                  </p>
                  <p className="product-info">
                    ♧ Para {product.people} personas
                  </p>

                  <div className="product-price">
                    {formatPrice(product.price)}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
