import { useState, useEffect, useRef } from "react";
import "./BoxForm.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../../../redux/categorySlice";
import { createBoxSolicitation } from "../../../../../redux/boxSolicitationSlice";
import { updateBox } from "../../../../../redux/boxSlice";

function BoxForm({ mode = "create", initialData = null, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const { items: categories, status: categoriesStatus } = useSelector(
    (state) => state.categories,
  );
  const fileInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [existingImages, setExistingImages] = useState(() =>
    mode === "edit" && initialData?.images ? initialData.images : [],
  );

  const [newImages, setNewImages] = useState([]);
  const [form, setForm] = useState(() =>
    mode === "edit" && initialData
      ? {
          title: initialData.title || initialData.name || "",
          category: initialData.category?.id || initialData.category || "", 
          price: initialData.price || "",
          shortDescription:
            initialData.shortDescription || initialData.description || "", 
          detailedDescription: initialData.detailedDescription || "",
          subProviders: initialData.subProviders || "",
          cancellationPolicy: initialData.cancellationPolicy || "",
          termsAccepted: false,
        }
      : {
          title: "",
          category: "",
          price: "",
          shortDescription: "",
          detailedDescription: "",
          subProviders: "",
          cancellationPolicy: "",
          termsAccepted: false,
        },
  );

  useEffect(() => {
    if (categoriesStatus === "idle") dispatch(fetchCategories());
  }, [dispatch, categoriesStatus]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const totalImages = existingImages.length + newImages.length;

  const handleImageChange = (e) => {
    const incoming = Array.from(e.target.files);
    const available = 4 - existingImages.length;
    setNewImages((prev) => [...prev, ...incoming].slice(0, available));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (mode === "create") {
        const fields = {
          title: form.title,
          shortDescription: form.shortDescription,
          detailedDescription: form.detailedDescription,
          price: parseFloat(form.price),
          categoryId: parseInt(form.category),
          cancellationPolicy: form.cancellationPolicy,
          subProviders: form.subProviders,
        };
        await dispatch(
          createBoxSolicitation({ fields, images: newImages }),
        ).unwrap();
      } else {
        const fields = {
          name: form.title,
          price: parseFloat(form.price),
          description: form.shortDescription,
          detailedDescription: form.detailedDescription,
          ...(form.category && { categoryId: parseInt(form.category) }),
          ...(form.cancellationPolicy && {
            cancellationPolicy: form.cancellationPolicy,
          }),
          ...(form.subProviders && { subProviders: form.subProviders }),
        };
        const keepImageIds = existingImages
          .filter((img) => img.id)
          .map((img) => img.id);
        await dispatch(
          updateBox({
            id: initialData.id,
            fields,
            images: newImages,
            keepImageIds,
          }),
        ).unwrap();
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Error al guardar los cambios.",
      );
    } finally {
      setSaving(false);
    }
  };

  const isEdit = mode === "edit";

  return (
    <div className="propose-box-container">
      <div className="pb-header">
        <h1>
          {isEdit ? `Editar Caja #${initialData?.id}` : "Proponer Nueva Caja"}
        </h1>
        <p>
          {isEdit
            ? "Modifica la informacion de la experiencia en tiempo real."
            : "Carga toda la informacion basica y descriptiva de la experiencia para enviarla a revision."}
        </p>
      </div>

      {error && (
        <div style={{ color: "red", fontWeight: "600", marginBottom: "1rem" }}>
          ⚠️ {error}
        </div>
      )}

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
              <p className="cd-hint">Hasta 4 imagenes. Formatos: JPG, PNG.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple={!isEdit} 
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <div className="cd-image-grid">
                {existingImages.map((img, i) => (
                  <div
                    key={`existing-${i}`}
                    className="cd-image-slot"
                    style={{ position: "relative", cursor: "default" }}
                  >
                    <img
                      src={img.url}
                      alt={`imagen-existente-${i}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(i)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "rgba(0,0,0,0.55)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        fontSize: "0.7rem",
                        lineHeight: "1",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {newImages.map((file, i) => (
                  <div
                    key={`new-${i}`}
                    className="cd-image-slot"
                    style={{ position: "relative", cursor: "default" }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(i)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "rgba(0,0,0,0.55)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        fontSize: "0.7rem",
                        lineHeight: "1",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {totalImages < 4 && (
                  <div
                    className="cd-image-slot"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ cursor: "pointer" }}
                    title={
                      isEdit
                        ? "Hacé click para añadir una foto a MySQL"
                        : "Añadir foto local"
                    }
                  >
                    <span>+</span>
                  </div>
                )}
              </div>
            </div>

            <div className="cd-section">
              <h2>Descripcion Detallada</h2>
              <div className="cd-editor-toolbar">
                <button type="button">B</button>
                <button type="button">
                  <i>I</i>
                </button>
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
                <div className="pb-campo" style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#2c3e3b",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Politica de Cancelacion
                  </label>
                  <select
                    name="cancellationPolicy"
                    value={form.cancellationPolicy}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una politica</option>
                    <option value="strict">
                      Estricta - Sin reembolso en 7 dias
                    </option>
                    <option value="moderate">
                      Moderada - Reembolso parcial
                    </option>
                    <option value="flexible">
                      Flexible - Reembolso completo
                    </option>
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
                    ? "Confirmo que las modificaciones cumplen con los estandares de la plataforma."
                    : "Confirmo que todos los terminos cumplen con los estandares globales de la plataforma."}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="pb-form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-pb-cancel"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-submit-final"
            disabled={!form.termsAccepted || saving}
          >
            {saving
              ? "Guardando..."
              : isEdit
                ? "Guardar Cambios ✓"
                : "Enviar Propuesta Final ✓"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoxForm;
