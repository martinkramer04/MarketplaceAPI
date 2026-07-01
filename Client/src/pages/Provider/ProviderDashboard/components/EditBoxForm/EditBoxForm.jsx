import React, { useState, useEffect, useRef } from 'react';
import './EditBoxForm.css';
import api from '../../../../../api/axiosConfig';
import { useToast } from '../../../../../Context/ToastContext';
import { getBoxImageUrl } from '../../../../utils/boxUtils';

function EditBoxForm({ propuestaInicial, onCancel, onUpdatePropuesta }) {
  const toast = useToast();
  // 🟢 Usamos una referencia para el input file oculto
  const fileInputRef = useRef(null);

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

  // 🟢 Estado local para manejar las imágenes actuales de la caja en tiempo real
  const [currentImages, setCurrentImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (propuestaInicial) {
      setForm({
        title: propuestaInicial.title || propuestaInicial.name || '',
        category: propuestaInicial.category || '',
        price: propuestaInicial.price || '',
        shortDescription: propuestaInicial.shortDescription || '',
        detailedDescription: propuestaInicial.detailedDescription || '',
        subProviders: propuestaInicial.subProviders || '',
        cancellationPolicy: propuestaInicial.cancellationPolicy || '',
        termsAccepted: false
      });
      // Guardamos las imágenes iniciales que vienen de la base de datos
      setCurrentImages(propuestaInicial.images || []);
    }
  }, [propuestaInicial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  // 🟢 Función para disparar el input file cuando hacen clic en un slot
  const handleSlotClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 🟢 Función que intercepta el archivo seleccionado y lo sube al backend vía Multipart
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('boxId', propuestaInicial.id);

    try {
      toast.info("Subiendo nueva imagen...");

      // Ejecutamos tu método del controller pasándole el MULTIPART_FORM_DATA
      await api.post('/api/boxes/add-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("¡Imagen subida con éxito!");

      // Volvemos a pedir los datos de la caja para actualizar la lista de imágenes con sus IDs nuevos
      const res = await api.get(`/api/boxes/${propuestaInicial.id}`);
      if (res.data && res.data.images) {
        setCurrentImages(res.data.images);
        if (onUpdatePropuesta) {
          onUpdatePropuesta({ ...propuestaInicial, images: res.data.images });
        }
      }
    } catch (err) {
      console.error("Error al subir la imagen:", err);
      toast.error("No se pudo guardar la imagen en el servidor.");
    } finally {
      // Limpiamos el input para poder subir el mismo archivo u otro consecutivamente
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.title,
      price: parseFloat(form.price),
      description: form.shortDescription,
    };

    try {
      await api.put(`/api/boxes/${propuestaInicial.id}`, payload);
      toast.success(`La caja "${form.title}" fue actualizada correctamente en la base de datos.`);

      if (onUpdatePropuesta) {
        // Enviamos la propuesta actualizada con las imágenes que subimos en caliente
        onUpdatePropuesta({ ...propuestaInicial, ...form, images: currentImages });
      }
    } catch (err) {
      console.error("Error al actualizar la caja:", err);
      toast.error(err.response?.data?.message || "No se pudieron guardar las modificaciones.");
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

      {/* 🟢 Input oculto que maneja el envío de binarios de las imágenes */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />

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

        <div className="cd-body">
          <div className="cd-left">
            <div className="cd-section">
              <h2>Imágenes de Alta Resolución</h2>
              <div className="cd-image-grid">
                {[0, 1, 2, 3].map((i) => {
                  // 🟢 Evaluamos usando nuestro estado local dinámico 'currentImages'
                  const hasImage = currentImages && currentImages[i];

                  return (
                    <div
                      key={i}
                      className="cd-image-slot"
                      style={{ overflow: 'hidden', padding: 0, cursor: 'pointer' }}
                      onClick={handleSlotClick} // 🟢 Al hacer click abre el explorador de archivos
                      title="Haz click para cambiar o agregar una foto"
                    >
                      {hasImage ? (
                        <img
                          src={getBoxImageUrl({ images: [currentImages[i]] })}
                          alt={`Caja slot ${i}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span>＋</span>
                      )}
                    </div>
                  );
                })}
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