import './ProposeBoxForm.css';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBoxSolicitation } from '../../../../../redux/boxSolicitationSlice';
import { fetchCategories } from '../../../../../redux/categorySlice';

function ProposeBoxForm({ onCancel }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.boxSolicitations);
  const { items: categories, status: categoryStatus } = useSelector(state => state.categories);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    category: '',
    price: '',
    shortDescription: '',
    detailedDescription: '',
    subProviders: '',
    cancellationPolicy: '',
    termsAccepted: false,
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (categoryStatus === 'idle') dispatch(fetchCategories());
  }, [categoryStatus, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 4);
    setImages(selected);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fields = {
      title: form.title,
      shortDescription: form.shortDescription,
      detailedDescription: form.detailedDescription,
      price: parseFloat(form.price),
      categoryId: parseInt(form.category),
      cancellationPolicy: form.cancellationPolicy,
      subProviders: form.subProviders,
    };
    try {
      await dispatch(createBoxSolicitation({ fields, images })).unwrap();
      if (onCancel) onCancel();
    } catch {
      // error is held in redux state
    }
  };

  return (
    <div className="propose-box-container">

      <div className="pb-header">
        <h1>Proponer Nueva Caja</h1>
        <p>Cargá toda la información básica, descriptiva e imágenes de la experiencia para enviarla a revisión.</p>
      </div>

      {error && (
        <div style={{ color: 'red', fontWeight: '600', marginBottom: '1rem' }}>
          ⚠️ {typeof error === 'string' ? error : 'Error al enviar la propuesta. Verificá que estés logueado.'}
        </div>
      )}

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
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.description}
                  </option>
                ))}
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
              placeholder="Describí brevemente la experiencia: qué incluye, para quién es ideal, qué hace única a tu propuesta..."
              required
            />
          </div>
        </div>

        <div className="cd-body">

          <div className="cd-left">

            <div className="cd-section">
              <h2>Imágenes de Alta Resolución</h2>
              <p className="cd-hint">Hasta 4 imágenes. Formatos: JPG, PNG.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <div className="cd-image-grid">
                {images.map((file, i) => (
                  <div
                    key={i}
                    className="cd-image-slot"
                    style={{ position: 'relative', cursor: 'default' }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.55)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.7rem', lineHeight: '1' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <div
                    className="cd-image-slot"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>＋</span>
                  </div>
                )}
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
                placeholder="Describí en detalle qué incluye la experiencia, cómo funciona el canje, condiciones especiales..."
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
                <span>Confirmo que todos los términos cumplen con los estándares globales de la plataforma BigBox.</span>
              </label>
            </div>

            <div className="cd-quality-score">
              <span>⭐ Puntaje de Calidad: 84%</span>
              <div className="cd-score-bar">
                <div className="cd-score-fill" style={{ width: '84%' }} />
              </div>
              <p>Tip: Agregar imágenes de alta resolución aumenta las conversiones hasta un 40%.</p>
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
            disabled={loading || !form.termsAccepted}
          >
            {loading ? 'Enviando...' : 'Enviar Propuesta Final ✓'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default ProposeBoxForm;
