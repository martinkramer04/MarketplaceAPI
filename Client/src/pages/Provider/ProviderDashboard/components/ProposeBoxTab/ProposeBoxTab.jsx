import './ProposeBoxTab.css'
import { useState } from 'react'

function ProposeBoxTab({ onSuccess }) {
    const [form, setForm] = useState({
        title: '',
        category: '',
        estimatedPrice: '',
        description: ''
    })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = () => {
        console.log('Nueva propuesta:', form)
        setSubmitted(true)
        setTimeout(() => {
            onSuccess()
        }, 2000)
    }

    if (submitted) {
        return (
            <div className="propose-success">
                <div className="propose-success-icon">✓</div>
                <h2>¡Propuesta enviada!</h2>
                <p>El equipo de BigBox revisará tu concepto. Te notificaremos cuando haya novedades.</p>
            </div>
        )
    }

    return (
        <div className="propose-box">
            <div className="tab-header">
                <h1>Proponer Nueva Caja</h1>
                <p>Paso 1 de 2 — Presentá el concepto. Tras la aprobación podrás cargar los detalles completos.</p>
            </div>

            <div className="propose-form-card">
                <div className="propose-form">

                    <div className="propose-campo">
                        <label>Título / Concepto de la Caja *</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Ej: Escapada Romántica en las Sierras"
                        />
                    </div>

                    <div className="propose-campo-row">
                        <div className="propose-campo">
                            <label>Categoría Destino *</label>
                            <select name="category" value={form.category} onChange={handleChange}>
                                <option value="">Seleccioná una categoría</option>
                                <option value="gastronomia">Gastronomía</option>
                                <option value="aventura">Aventura</option>
                                <option value="bienestar">Bienestar</option>
                                <option value="estadias">Estadías</option>
                                <option value="cultura">Cultura y Arte</option>
                                <option value="cursos">Cursos y Talleres</option>
                            </select>
                        </div>
                        <div className="propose-campo">
                            <label>Precio Estimado de Venta (ARS) *</label>
                            <input
                                name="estimatedPrice"
                                type="number"
                                value={form.estimatedPrice}
                                onChange={handleChange}
                                placeholder="Ej: 120000"
                            />
                        </div>
                    </div>

                    <div className="propose-campo">
                        <label>Descripción breve *</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Describí brevemente la experiencia: qué incluye, para quién es ideal, qué hace única a tu propuesta..."
                        />
                    </div>

                    <div className="propose-info-box">
                        ℹ️ Una vez aprobada esta propuesta por el equipo de BigBox, podrás cargar imágenes, sub-proveedores y los términos del servicio para la publicación final.
                    </div>

                    <button className="btn-propose-submit" onClick={handleSubmit}>
                        Enviar Propuesta →
                    </button>

                </div>
            </div>
        </div>
    )
}

export default ProposeBoxTab