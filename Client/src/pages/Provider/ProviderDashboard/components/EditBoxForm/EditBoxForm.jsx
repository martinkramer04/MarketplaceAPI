import React, { useState, useEffect } from 'react';
import './EditBoxForm.css';

function EditBoxForm({ propuestaInicial, onCancel, onUpdatePropuesta }) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    price: '',
    shortDescription: '',
    detailedDescription: '',
    subProviders: '',
    cancellationPolicy: '',
    termsAccepted: false
  });

  useEffect(() => {
    if (propuestaInicial) {
      setForm({
        title: propuestaInicial.title || '',
        category: propuestaInicial.category || '',
        price: propuestaInicial.price || '',
        shortDescription: propuestaInicial.shortDescription || '',
        detailedDescription: propuestaInicial.detailedDescription || '',
        subProviders: propuestaInicial.subProviders || '',
        cancellationPolicy: propuestaInicial.cancellationPolicy || '',
        termsAccepted: false
      });
    }
  }, [propuestaInicial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdatePropuesta) {
      onUpdatePropuesta({ ...propuestaInicial, ...form });
    } else {
      console.log('Edición de propuesta enviada:', form);
      alert('¡Modificaciones enviadas! El administrador revisará y aprobará los cambios antes de publicarlos.');
    }
  };

  return (
    <div className="propose-box-container">
      
      <div className="pb-header">
        <h1>Editar Propuesta de Caja</h1>
        <p>Modificá la información de la experiencia. Los cambios pasarán por una revisión del administrador antes de impactar en vivo.</p>
      </div>

      <form onSubmit={handleSubmit} className="pb-unified-form">
        
        <div className="pb-form-card step-one-section">
          <div className="pb-campo">
            <label htmlFor="title">Título / Concepto de la Caja *</label>
            <input 
              type="text" 
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ej: Escapada Romántica en las Sierras"
              required 
            />
          </div>

          <div className="pb-campo-row">
            <div className="pb-campo">
              <label htmlFor="category">Categoría Destino *</label>
              <select 
                id="category" 
                name="category"
                value={form.category} 
                onChange={handleChange} 
                required
              >
                <option value="">Seleccioná una categoría</option>
                <option value="spa">SPA</option>
                <option value="adventure">Aventura</option>
                <option value="dining">Gastronomía</option>
              </select>
            </div>

            <div className="pb-campo">
              <label htmlFor="price">Precio Estimado de Venta (ARS) *</label>
              <input 
                type="number" 
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Ej: 120000"
                required 
              />
            </div>
          </div>

          <div className="pb-campo">
            <label htmlFor="shortDescription">Descripción breve *</label>
            <textarea 
              id="shortDescription"
              name="shortDescription"
              rows={3} 
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Describí brevemente la experiencia..."
              required
            />
          </div>
        </div>

        <div className="cd-body">

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
                <button type="button">B</button>
                <button type="button"><i>I</i></button>
                <button type="button">≡</button>
                <button type="button">🔗</button>
              </div>
              <textarea
                name="detailedDescription"
                value={form.detailedDescription}
                onChange={handleChange}
                rows={6}
                placeholder="Describí en detalle qué incluye la experiencia..."
                required
              />
            </div>

          </div>

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
              <div className="pb-campo" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2c3e3b', marginBottom: '8px', display: 'block' }}>
                  Política de Cancelación
                </label>
                <select
                  name="cancellationPolicy"
                  value={form.cancellationPolicy}
                  onChange={handleChange}
                  required
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
                  required
                />
                <span>Confirmo que las modificaciones cumplen con los estándares globales de la plataforma BigBox.</span>
              </label>
            </div>

            <div className="cd-quality-score">
              <span>⭐ Puntaje de Calidad: 84%</span>
              <div className="cd-score-bar">
                <div className="cd-score-fill" style={{ width: '84%' }} />
              </div>
              <p>Tip: Mantener la información actualizada mejora la visibilidad de tus cajas.</p>
            </div>

          </div>
        </div>

        <div className="pb-form-actions">
          <button type="button" onClick={onCancel} className="btn-pb-cancel">
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-submit-final" 
            disabled={!form.termsAccepted}
          >
            Enviar Cambios a Revisión ✓
          </button>
        </div>

      </form>
    </div>
  );
}

export default EditBoxForm;