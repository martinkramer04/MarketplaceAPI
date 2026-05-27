import './BecomeProvider.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function BecomeProvider() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        // Datos personales/empresa
        businessName: '',
        ownerName: '',
        email: '',
        phone: '',
        website: '',
        // Rubro y ubicacion
        category: '',
        description: '',
        location: '',
        address: '',
        // Productos y precios
        experienceName: '',
        experienceDescription: '',
        minPrice: '',
        maxPrice: '',
        capacity: '',
        duration: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = () => {
        console.log('Solicitud enviada:', formData)
        setStep(4) // pantalla de éxito
    }

    return (
        <div className="become-provider">

            {/* HEADER */}
            <div className="bp-header">
                <h1>Convertite en Proveedor</h1>
                <p>Sumá tus experiencias a BigBox y llegá a miles de clientes.</p>
            </div>

            {/* STEPPER */}
            <div className="bp-stepper">
                {['Datos de empresa', 'Rubro y ubicación', 'Experiencias'].map((label, i) => (
                    <div key={label} className="bp-step-item">
                        <div className={`bp-step-circle ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
                            {step > i + 1 ? '✓' : i + 1}
                        </div>
                        <span className={step === i + 1 ? 'active' : ''}>{label}</span>
                        {i < 2 && <div className={`bp-step-line ${step > i + 1 ? 'done' : ''}`} />}
                    </div>
                ))}
            </div>

            {/* FORMULARIO */}
            <div className="bp-form-container">

                {/* PASO 1 - Datos de empresa */}
                {step === 1 && (
                    <div className="bp-form">
                        <h2>Datos de tu empresa</h2>

                        <div className="bp-campo">
                            <label>Nombre de la empresa *</label>
                            <input
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Ej: Spa La Serena"
                            />
                        </div>

                        <div className="bp-campo">
                            <label>Nombre del responsable *</label>
                            <input
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                placeholder="Nombre y apellido"
                            />
                        </div>

                        <div className="bp-campo-row">
                            <div className="bp-campo">
                                <label>Email de contacto *</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="contacto@empresa.com"
                                />
                            </div>
                            <div className="bp-campo">
                                <label>Teléfono *</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+54 11 0000-0000"
                                />
                            </div>
                        </div>

                        <div className="bp-campo">
                            <label>Sitio web (opcional)</label>
                            <input
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="www.tuempresa.com"
                            />
                        </div>

                        <div className="bp-form-actions">
                            <button className="btn-next" onClick={() => setStep(2)}>
                                Siguiente →
                            </button>
                        </div>
                    </div>
                )}

                {/* PASO 2 - Rubro y ubicacion */}
                {step === 2 && (
                    <div className="bp-form">
                        <h2>Rubro y ubicación</h2>

                        <div className="bp-campo">
                            <label>Categoría principal *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Seleccioná una categoría</option>
                                <option value="gastronomia">Gastronomía</option>
                                <option value="bienestar">Bienestar y Spa</option>
                                <option value="aventura">Aventura y Deportes</option>
                                <option value="estadias">Estadías y Hoteles</option>
                                <option value="cultura">Cultura y Arte</option>
                                <option value="cursos">Cursos y Talleres</option>
                            </select>
                        </div>

                        <div className="bp-campo">
                            <label>Descripción del negocio *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Contanos brevemente a qué se dedica tu empresa y qué tipo de experiencias ofrecés..."
                                rows={4}
                            />
                        </div>

                        <div className="bp-campo-row">
                            <div className="bp-campo">
                                <label>Ciudad / Provincia *</label>
                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Ej: Buenos Aires, CABA"
                                />
                            </div>
                            <div className="bp-campo">
                                <label>Dirección</label>
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Calle y número"
                                />
                            </div>
                        </div>

                        <div className="bp-form-actions">
                            <button className="btn-back" onClick={() => setStep(1)}>
                                ← Atrás
                            </button>
                            <button className="btn-next" onClick={() => setStep(3)}>
                                Siguiente →
                            </button>
                        </div>
                    </div>
                )}

                {/* PASO 3 - Experiencias y precios */}
                {step === 3 && (
                    <div className="bp-form">
                        <h2>Tu experiencia principal</h2>

                        <div className="bp-campo">
                            <label>Nombre de la experiencia *</label>
                            <input
                                name="experienceName"
                                value={formData.experienceName}
                                onChange={handleChange}
                                placeholder="Ej: Cena romántica para dos"
                            />
                        </div>

                        <div className="bp-campo">
                            <label>Descripción de la experiencia *</label>
                            <textarea
                                name="experienceDescription"
                                value={formData.experienceDescription}
                                onChange={handleChange}
                                placeholder="Describí qué incluye la experiencia, cómo es, qué pueden esperar los clientes..."
                                rows={4}
                            />
                        </div>

                        <div className="bp-campo-row">
                            <div className="bp-campo">
                                <label>Precio mínimo (ARS) *</label>
                                <input
                                    name="minPrice"
                                    type="number"
                                    value={formData.minPrice}
                                    onChange={handleChange}
                                    placeholder="Ej: 50000"
                                />
                            </div>
                            <div className="bp-campo">
                                <label>Precio máximo (ARS)</label>
                                <input
                                    name="maxPrice"
                                    type="number"
                                    value={formData.maxPrice}
                                    onChange={handleChange}
                                    placeholder="Ej: 150000"
                                />
                            </div>
                        </div>

                        <div className="bp-campo-row">
                            <div className="bp-campo">
                                <label>Capacidad (personas)</label>
                                <input
                                    name="capacity"
                                    type="number"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    placeholder="Ej: 2"
                                />
                            </div>
                            <div className="bp-campo">
                                <label>Duración estimada</label>
                                <input
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="Ej: 3 horas"
                                />
                            </div>
                        </div>

                        <div className="bp-form-actions">
                            <button className="btn-back" onClick={() => setStep(2)}>
                                ← Atrás
                            </button>
                            <button className="btn-submit" onClick={handleSubmit}>
                                Enviar solicitud ✓
                            </button>
                        </div>
                    </div>
                )}

                {/* PASO 4 - Exito */}
                {step === 4 && (
                    <div className="bp-success">
                        <div className="bp-success-icon">✓</div>
                        <h2>¡Solicitud enviada!</h2>
                        <p>Recibimos tu información. Nuestro equipo la revisará y te contactaremos a <strong>{formData.email}</strong> en los próximos días hábiles.</p>
                        <button className="btn-next" onClick={() => navigate('/')}>
                            Volver al inicio
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default BecomeProvider