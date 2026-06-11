import "./Home.css";
import BoxCard from "../../components/BoxCard/BoxCard";
import boxes from "../../data/Boxes";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'

// Íconos y orden de las 4 categorías principales del Home
const categoriasPrincipales = [
  { name: 'Experiencias Gastronómicas', icon: '🍽️' },
  { name: 'Aventura', icon: '🧭' },
  { name: 'Entretenimiento', icon: '🎭' },
  { name: 'Estadías', icon: '🏨' },
]

function Home() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [errorCats, setErrorCats] = useState(null)

  useEffect(() => {
    fetch('http://localhost:4002/api/categories')
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })
      .then(data => {
        // Filtramos solo las 4 principales y les asignamos su ícono
        const filtradas = categoriasPrincipales
          .map(principal => {
            const encontrada = data.find(cat => cat.name === principal.name)
            return encontrada ? { ...encontrada, icon: principal.icon } : null
          })
          .filter(cat => cat !== null)

        setCategories(filtradas)
        setLoadingCats(false)
      })
      .catch(err => {
        console.error('Error al cargar categorías:', err)
        setErrorCats('No se pudieron cargar las categorías.')
        setLoadingCats(false)
      })
  }, [])

  // Al hacer click navega al Explore con la categoría preseleccionada
  const handleCategoryClick = (categoryId) => {
    navigate(`/explore?category=${categoryId}`)
  }

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

          {loadingCats && <p>Cargando categorías...</p>}
          {errorCats && <p>{errorCats}</p>}

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
          {boxes.map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;