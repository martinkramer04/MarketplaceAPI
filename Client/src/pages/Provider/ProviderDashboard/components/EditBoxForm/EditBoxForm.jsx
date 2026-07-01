import React, { useState, useEffect } from 'react';
import './EditBoxForm.css';
import api from '../../../../../api/axiosConfig'; // 🟢 Traemos Axios

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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (propuestaInicial) {
      setForm({
        title: propuestaInicial.title || propuestaInicial.name || '', // Resguardo por si en tu BD se llama name
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Mapeamos el payload adaptado a lo que espera tu entidad Box de Java
    const payload = {
      name: form.title, // Asegurate si tu entidad en Java usa name o title
      price: parseFloat(form.price),
      description: form.shortDescription,
      // Sumá acá los campos extras si tu base de datos los requiere
    };

    try {
      // 🟢 Mandamos el PUT real a MySQL a través de tu endpoint de Admin/Provider
      await api.put(`/api/boxes/${propuestaInicial.id}`, payload);

      alert('¡Modificaciones guardadas e impactadas con éxito!');
      if (onUpdatePropuesta) {
        onUpdatePropuesta({ ...propuestaInicial, ...form });
      }
    } catch (err) {
      console.error("Error al actualizar la caja:", err);
      alert(err.response?.data?.message || "Error interno al guardar los cambios en la base de datos.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="propose-box-container">
      <div className="pb-header">
        <h1>Editar Propuesta de Caja #{propuestaInicial?.id}</h1>
        <p>Modificá la información de la experiencia en tiempo real de tu catálogo.</p>
      </div>

      <form onSubmit={handleSubmit} className="pb-unified-form">
        <div className="pb-form-card step-one-section">
          <div className="pb-campo">
            <label htmlFor="title">Título / Concepto de la Caja *</label>
            <input type="text" id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="pb-campo-row">
            <div className="pb-campo">
              <label htmlFor="category">Categoría Destino *</label>
              <select id="category" name="category" value={form.category} onChange={handleChange} required>
                <option value="">Seleccioná una categoría</option>
                <option value="spa">SPA</option>
                <option value="adventure">Aventura</option>
                <option value="dining">Gastronomía</option>
              </select>
            </div>

            <div className="pb-campo">
              <label htmlFor="price">Precio de Venta (ARS) *</label>
              <input type="number" id="price" name="price" value={form.price} onChange={handleChange} required />
            </div>
          </div>

          <div className="pb-campo">
            <label htmlFor="shortDescription">Descripción breve *</label>
            <textarea id="shortDescription" name="shortDescription" rows={3} value={form.shortDescription} onChange={handleChange} required />
          </div>
        </div>

        {/* Sección de Imágenes y editor intermedio */}
        <div className="cd-body">
          <div className="cd-left">
            <div className="cd-section">
              <h2>Imágenes de Alta Resolución</h2>
              <div className="cd-image-grid">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="cd-image-slot"><span>＋</span></div>
                ))}
              </div>
            </div>
            <div className="cd-section">
              <h2>Descripción Detallada</h2>
              <textarea name="detailedDescription" value={form.detailedDescription} onChange={handleChange} rows={4} required />
            </div>
          </div>

          <div className="cd-right">
            <div className="cd-section">
              <h2>Términos del Servicio</h2>
              <label className="cd-checkbox">
                <input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} required />
                <span>Confirmo que las modificaciones cumplen con los estándares de la plataforma Boxify.</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pb-form-actions">
          <button type="button" onClick={onCancel} className="btn-pb-cancel" disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit-final" disabled={!form.termsAccepted || saving}>
            {saving ? "Guardando..." : "Guardar Cambios en Base de Datos ✓"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBoxForm;