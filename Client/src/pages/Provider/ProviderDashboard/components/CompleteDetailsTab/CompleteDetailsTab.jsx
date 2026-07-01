import './CompleteDetailsTab.css'
import { useState } from 'react'

function CompleteDetailsTab({ request, onBack }) {
    const [form, setForm] = useState({
        detailedDescription: '',
        subProviders: '',
        cancellationPolicy: '',
        termsAccepted: false
    })

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm({ ...form, [e.target.name]: value })
    }

    const handleSubmit = () => {
        console.log('Detalles finales enviados:', form)
        alert('¡Detalles enviados! El administrador revisará y publicará tu caja.')
        onBack()
    }

    return (
        <div className="complete-details">

            <div className="cd-header">
                <button className="btn-back-tab" onClick={onBack}>← Volver</button>
                <div>
                    <span className="cd-badge">✅ Aprobado — Completar Paso 2</span>
                    <h1>{request?.title || 'Completar Detalles de la Caja'}</h1>
                    <p>Cargá toda la información necesaria para que Boxify publique tu caja oficialmente.</p>
                </div>
            </div>

            <div className="cd-body">

                {/* COLUMNA IZQUIERDA */}
                <div className="cd-left">

                    <div className="cd-section">
                        <h2>Imágenes de Alta Resolución</h2>
                        <p className="cd-hint">Mínimo 3000px de ancho. Formatos: JPG, PNG.</p>
                        <div className="cd-image-grid">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className="cd-image-slot">
                                    <span>＋</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cd-section">
                        <h2>Descripción Detallada</h2>
                        <div className="cd-editor-toolbar">
                            <button>B</button>
                            <button><i>I</i></button>
                            <button>≡</button>
                            <button>🔗</button>
                        </div>
                        <textarea
                            name="detailedDescription"
                            value={form.detailedDescription}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Describí en detalle qué incluye la experiencia, cómo funciona el canje, condiciones especiales..."
                        />
                    </div>

                </div>

                {/* COLUMNA DERECHA */}
                <div className="cd-right">

                    <div className="cd-section">
                        <h2>Sub-proveedores</h2>
                        <div className="cd-subproviders">
                            <div className="cd-subprovider-item">
                                <div className="cd-sp-avatar">SC</div>
                                <div>
                                    <strong>Sommelier Catering</strong>
                                    <p>Socio gastronómico</p>
                                </div>
                                <span className="cd-sp-check">✓</span>
                            </div>
                            <div className="cd-subprovider-item">
                                <div className="cd-sp-avatar">BT</div>
                                <div>
                                    <strong>BlackLine Transport</strong>
                                    <p>Logística de lujo</p>
                                </div>
                                <span className="cd-sp-check">✓</span>
                            </div>
                        </div>
                        <textarea
                            name="subProviders"
                            value={form.subProviders}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Agregá otros socios participantes..."
                        />
                    </div>

                    <div className="cd-section">
                        <h2>Términos del Servicio</h2>
                        <div className="cd-campo">
                            <label>Política de Cancelación</label>
                            <select
                                name="cancellationPolicy"
                                value={form.cancellationPolicy}
                                onChange={handleChange}
                            >
                                <option value="">Seleccioná una política</option>
                                <option value="strict">Estricta — Sin reembolso en 7 días</option>
                                <option value="moderate">Moderada — Reembolso parcial</option>
                                <option value="flexible">Flexible — Reembolso completo</option>
                            </select>
                        </div>
                        <label className="cd-checkbox">
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                checked={form.termsAccepted}
                                onChange={handleChange}
                            />
                            Confirmo que todos los términos cumplen con los estándares globales de la plataforma Boxify.
                        </label>
                    </div>

                    <div className="cd-quality-score">
                        <span>⭐ Puntaje de Calidad: 84%</span>
                        <div className="cd-score-bar">
                            <div className="cd-score-fill" style={{ width: '84%' }} />
                        </div>
                        <p>Tip: Agregar imágenes de alta resolución aumenta las conversiones hasta un 40%.</p>
                    </div>

                    <button
                        className="btn-submit-final"
                        onClick={handleSubmit}
                        disabled={!form.termsAccepted}
                    >
                        Enviar Detalles para Publicación ✓
                    </button>

                </div>
            </div>
        </div>
    )
}

export default CompleteDetailsTab