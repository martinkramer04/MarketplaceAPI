import "./BecomeProvider.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSolicitation } from "../../../redux/providerSolicitationSlice";

function BecomeProvider() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(
    (state) => state.providerSolicitations,
  );

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    website: "",
    category: "",
    description: "",
    location: "",
    address: "",
    experienceName: "",
    experienceDescription: "",
    minPrice: "",
    maxPrice: "",
    capacity: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      minPrice: Number(formData.minPrice),
      maxPrice: formData.maxPrice ? Number(formData.maxPrice) : null,
      capacity: formData.capacity ? Number(formData.capacity) : null,
    };

    try {
      await dispatch(createSolicitation(payload)).unwrap();
      setStep(4);
    } catch {
      // error is held in redux state
    }
  };

  return (
    <div className="become-provider">
      {/* HEADER */}
      <div className="bp-header">
        <h1>Convertite en Proveedor</h1>
        <p>Sumá tus experiencias a Boxify y llegá a miles de clientes.</p>
      </div>

      {step < 4 && (
        <div className="bp-stepper">
          <div className="bp-step-item">
            <div
              className={`bp-step-circle ${step === 1 ? "active" : ""} ${step > 1 ? "done" : ""}`}
            >
              1
            </div>
            <span className={step === 1 ? "active" : ""}>Empresa</span>
          </div>
          <div className={`bp-step-line ${step > 1 ? "done" : ""}`}></div>

          <div className="bp-step-item">
            <div
              className={`bp-step-circle ${step === 2 ? "active" : ""} ${step > 2 ? "done" : ""}`}
            >
              2
            </div>
            <span className={step === 2 ? "active" : ""}>
              Rubro y Ubicación
            </span>
          </div>
          <div className={`bp-step-line ${step > 2 ? "done" : ""}`}></div>

          <div className="bp-step-item">
            <div className={`bp-step-circle ${step === 3 ? "active" : ""}`}>
              3
            </div>
            <span className={step === 3 ? "active" : ""}>Experiencia</span>
          </div>
        </div>
      )}

      <div className="bp-form-container">
        {error && (
          <div
            style={{ color: "red", marginBottom: "20px", fontWeight: "bold" }}
          >
            ⚠️ {typeof error === "string" ? error : "Ocurrió un error al enviar la solicitud."}
          </div>
        )}

        <div className="bp-form">
          {/* PASO 1 - Datos de Empresa */}
          {step === 1 && (
            <>
              <h2>Datos Personales o de la Empresa</h2>
              <div className="bp-campo">
                <label>Nombre del Negocio / Razón Social *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Ej: Spa Las Condes SRL"
                />
              </div>
              <div className="bp-campo">
                <label>Nombre del Dueño / Contacto Principal *</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div className="bp-campo-row">
                <div className="bp-campo">
                  <label>Email de Contacto *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contacto@empresa.com"
                  />
                </div>
                <div className="bp-campo">
                  <label>Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ej: +54 9 11 1234 5678"
                  />
                </div>
              </div>
              <div className="bp-campo">
                <label>Sitio Web / Red Social (Opcional)</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.tuweb.com"
                />
              </div>
              <div className="bp-form-actions">
                <button
                  className="btn-next"
                  onClick={() => setStep(2)}
                  disabled={
                    !formData.businessName ||
                    !formData.ownerName ||
                    !formData.email ||
                    !formData.phone
                  }
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* PASO 2 - Rubro y Ubicación */}
          {step === 2 && (
            <>
              <h2>Rubro y Ubicación</h2>
              <div className="bp-campo-row">
                <div className="bp-campo">
                  <label>Categoría Principal *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Seleccioná un rubro...</option>
                    <option value="GASTRONOMIA">Gastronomía</option>
                    <option value="AVENTURA">Aventura</option>
                    <option value="BIENESTAR">Bienestar / Spa</option>
                    <option value="ENTRETENIMIENTO">Entretenimiento</option>
                    <option value="ESTADIAS">Estadías / Hotelería</option>
                  </select>
                </div>
                <div className="bp-campo">
                  <label>Localidad / Provincia *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ej: Mendoza, Argentina"
                  />
                </div>
              </div>
              <div className="bp-campo">
                <label>Dirección Física (Opcional)</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ej: Av. San Martín 1234"
                />
              </div>
              <div className="bp-campo">
                <label>Breve Descripción del Negocio *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Contanos brevemente a qué se dedican..."
                  rows="3"
                />
              </div>
              <div className="bp-form-actions">
                <button className="btn-back" onClick={() => setStep(1)}>
                  ← Atrás
                </button>
                <button
                  className="btn-next"
                  onClick={() => setStep(3)}
                  disabled={
                    !formData.category ||
                    !formData.location ||
                    !formData.description
                  }
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* PASO 3 - Propuesta de Experiencia */}
          {step === 3 && (
            <>
              <h2>Propuesta de Experiencia para Boxify</h2>
              <div className="bp-campo">
                <label>Nombre de la Experiencia *</label>
                <input
                  type="text"
                  name="experienceName"
                  value={formData.experienceName}
                  onChange={handleChange}
                  placeholder="Ej: Circuito Hídrico Termal + Masaje"
                />
              </div>
              <div className="bp-campo">
                <label>¿Qué incluye la experiencia? *</label>
                <textarea
                  name="experienceDescription"
                  value={formData.experienceDescription}
                  onChange={handleChange}
                  placeholder="Detallá los servicios incluidos..."
                  rows="3"
                />
              </div>
              <div className="bp-campo-row">
                <div className="bp-campo">
                  <label>Precio Mínimo ($) *</label>
                  <input
                    type="number"
                    name="minPrice"
                    value={formData.minPrice}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
                <div className="bp-campo">
                  <label>Precio Máximo ($) *</label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={formData.maxPrice}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="bp-campo-row">
                <div className="bp-campo">
                  <label>Capacidad Máxima por turno</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Ej: 2"
                  />
                </div>
                <div className="bp-campo">
                  <label>Duración estimada</label>
                  <input
                    type="text"
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
                <button
                  className="btn-submit"
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !formData.experienceName ||
                    !formData.experienceDescription ||
                    !formData.minPrice ||
                    !formData.maxPrice
                  }
                >
                  {loading ? "Enviando..." : "Enviar solicitud ✓"}
                </button>
              </div>
            </>
          )}

          {/* PASO 4 - Éxito */}
          {step === 4 && (
            <div className="bp-success">
              <div className="bp-success-icon">✓</div>
              <h2>¡Solicitud enviada!</h2>
              <p>
                Recibimos tu información. Nuestro equipo la revisará y te
                contactaremos a <strong>{formData.email}</strong> en los
                próximos días hábiles.
              </p>
              <button className="btn-next" onClick={() => navigate("/")}>
                Volver al inicio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BecomeProvider;
