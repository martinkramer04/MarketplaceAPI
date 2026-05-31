import './ProviderDetail.css'

function ProviderDetail({ proveedor, onBack }) {
    return (
        <div className="prov-detalle">

            {/* HEADER */}
            <div className="pd-header">
                <button className="btn-back-admin" onClick={onBack}>← Volver</button>
                <div>
                    <h1>{proveedor.nombre}</h1>
                    <span className={`admin-badge ${proveedor.estado === 'active' ? 'badge-approved' : 'badge-pending'}`}>
                        {proveedor.estado === 'active' ? '● Activo' : '● Pendiente de aprobación'}
                    </span>
                </div>
            </div>

            <div className="pd-body">

                {/* COLUMNA IZQUIERDA - Datos del formulario */}
                <div className="pd-left">

                    <div className="pd-card">
                        <h2>Datos de la Empresa</h2>
                        <div className="pd-info-grid">
                            <div className="pd-info-item">
                                <span>Responsable</span>
                                <strong>{proveedor.ownerName}</strong>
                            </div>
                            <div className="pd-info-item">
                                <span>Email</span>
                                <strong>{proveedor.email}</strong>
                            </div>
                            <div className="pd-info-item">
                                <span>Teléfono</span>
                                <strong>{proveedor.phone}</strong>
                            </div>
                            <div className="pd-info-item">
                                <span>Sitio Web</span>
                                <strong>{proveedor.website || '—'}</strong>
                            </div>
                            <div className="pd-info-item">
                                <span>Ciudad</span>
                                <strong>{proveedor.ciudad}</strong>
                            </div>
                            <div className="pd-info-item">
                                <span>Dirección</span>
                                <strong>{proveedor.address}</strong>
                            </div>
                            <div className="pd-info-item">
                                <span>Rubro</span>
                                <strong>{proveedor.rubro}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="pd-card">
                        <h2>Descripción del Negocio</h2>
                        <p className="pd-description">{proveedor.description}</p>
                    </div>

                </div>

                {/* COLUMNA DERECHA - Cajas publicadas */}
                <div className="pd-right">

                    <div className="pd-card">
                        <h2>Cajas Publicadas ({proveedor.cajasPublicadas.length})</h2>

                        {proveedor.cajasPublicadas.length === 0 ? (
                            <div className="pd-empty">
                                <span>📦</span>
                                <p>Este proveedor aún no tiene cajas publicadas.</p>
                            </div>
                        ) : (
                            <div className="pd-cajas-list">
                                {proveedor.cajasPublicadas.map((caja) => (
                                    <div key={caja.id} className="pd-caja-item">
                                        <div className="pd-caja-thumb" />
                                        <div className="pd-caja-info">
                                            <strong>{caja.name}</strong>
                                            <span>${caja.price} por caja</span>
                                        </div>
                                        <div className="pd-caja-stats">
                                            <span className="pd-caja-activations">⚡ {caja.activations}</span>
                                            <span className="admin-badge badge-approved">● Publicada</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ACCIONES ADMIN */}
                    <div className="pd-card pd-actions-card">
                        <h2>Acciones</h2>
                        <div className="pd-actions">
                            {proveedor.estado === 'pending' && (
                                <button className="btn-approve-prov">
                                    ✓ Aprobar Proveedor
                                </button>
                            )}
                            <button className="btn-suspend-prov">
                                ⊘ Suspender Cuenta
                            </button>
                            <button className="btn-contact-prov">
                                ✉ Contactar Proveedor
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProviderDetail