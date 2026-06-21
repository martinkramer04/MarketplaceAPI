import { useState, useEffect } from 'react'
import '../ProposeBoxForm/ProposeBoxForm.css'
import api from '../../../../../api/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '../../../../../redux/categorySlice'

function BoxForm({ mode = 'create', initialData = null, onSuccess, onCancel }) {
  const dispatch = useDispatch()
  const { items: categories, status: categoriesStatus } = useSelector((state) => state.categories)

  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: '',
    price: '',
    shortDescription: '',
    detailedDescription: '',
    subProviders: '',
    cancellationPolicy: '',
    termsAccepted: false,
  })

  useEffect(() => {
    if (categoriesStatus === 'idle') dispatch(fetchCategories())
  }, [dispatch, categoriesStatus])

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        title: initialData.title || initialData.name || '',
        category: initialData.category || '',
        price: initialData.price || '',
        shortDescription: initialData.shortDescription || '',
        detailedDescription: initialData.detailedDescription || '',
        subProviders: initialData.subProviders || '',
        cancellationPolicy: initialData.cancellationPolicy || '',
        termsAccepted: false,
      })
    }
  }, [mode, initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload =
      mode === 'create'
        ? {
            name: form.title,
            description: form.shortDescription,
            price: parseFloat(form.price),
            stock: 0,
            categoryId: parseInt(form.category),
          }
        : {
            name: form.title,
            price: parseFloat(form.price),
            description: form.shortDescription,
          }

    try {
      if (mode === 'create') {
        await api.post('/api/boxes', payload)
      } else {
        await api.put(`/api/boxes/${initialData.id}`, payload)
      }
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error al guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  const isEdit = mode === 'edit'

  return (
    <div className="propose-box-container">
      <div className="pb-header">
        <h1>{isEdit ? `Editar Caja #${initialData?.id}` : 'Proponer Nueva Caja'}</h1>
        <p>
          {isEdit
            ? 'Modifica la informacion de la experiencia en tiempo real.'
            : 'Carga toda la informacion basica y descriptiva de la experiencia.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="pb-unified-form">
        <div className="pb-form-card step-one-section">
          <div className="pb-campo">
            <label htmlFor="title">Titulo / Concepto de la Caja *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ej: Escapada Romantica en las Sierras"
              required
            />
          </div>

          <div className="pb-campo-row">
            <div className="pb-campo">
              <label htmlFor="category">Categoria Destino *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.description || cat.name}
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
            <label htmlFor="shortDescription">Descripcion breve *</label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={3}
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Describe brevemente la experiencia..."
              required
            />
          </div>
        </div>

        <div className="cd-body">
          <div className="cd-left">
            <div className="cd-section">
              <h2>Imagenes de Alta Resolucion</h2>
              <p className="cd-hint">Minimo 3000px de ancho. Formatos: JPG, PNG.</p>
              <div className="cd-image-grid">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="cd-image-slot">
                    <span>+</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cd-section">
              <h2>Descripcion Detallada</h2>
              <div className="cd-editor-toolbar">
                <button type="button">B</button>
                <button type="button"><i>I</i></button>
                <button type="button">&#8801;</button>
              </div>
              <textarea
                name="detailedDescription"
                value={form.detailedDescription}
                onChange={handleChange}
                rows={6}
                placeholder="Describe en detalle que incluye la experiencia..."
                required
              />
            </div>
          </div>

          <div className="cd-right">
            {!isEdit && (
              <div className="cd-section">
                <h2>Sub-proveedores</h2>
                <textarea
                  name="subProviders"
                  value={form.subProviders}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Agrega otros socios participantes..."
                />
              </div>
            )}

            <div className="cd-section">
              <h2>Terminos del Servicio</h2>
              {!isEdit && (
                <div className="pb-campo" style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2c3e3b', marginBottom: '8px', display: 'block' }}>
                    Politica de Cancelacion
                  </label>
                  <select name="cancellationPolicy" value={form.cancellationPolicy} onChange={handleChange} required>
                    <option value="">Selecciona una politica</option>
                    <option value="strict">Estricta - Sin reembolso en 7 dias</option>
                    <option value="moderate">Moderada - Reembolso parcial</option>
                    <option value="flexible">Flexible - Reembolso completo</option>
                  </select>
                </div>
              )}
              <label className="cd-checkbox">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={form.termsAccepted}
                  onChange={handleChange}
                  required
                />
                <span>
                  {isEdit
                    ? 'Confirmo que las modificaciones cumplen con los estandares de la plataforma.'
                    : 'Confirmo que todos los terminos cumplen con los estandares globales de la plataforma.'}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="pb-form-actions">
          <button type="button" onClick={onCancel} className="btn-pb-cancel" disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit-final" disabled={!form.termsAccepted || saving}>
            {saving
              ? 'Guardando...'
              : isEdit
              ? 'Guardar Cambios ✓'
              : 'Enviar Propuesta Final ✓'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BoxForm