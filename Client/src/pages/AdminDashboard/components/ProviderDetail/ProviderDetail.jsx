import './ProviderDetail.css'

const CATEGORY_LABELS = {
    GASTRONOMIA: 'Gastronomía',
    AVENTURA: 'Aventura',
    BIENESTAR: 'Bienestar / Spa',
    ENTRETENIMIENTO: 'Entretenimiento',
    ESTADIAS: 'Estadías / Hotelería',
}

function InfoItem({ label, value }) {
    if (value == null || value === '') return null
    return (
        <div className="pd-info-item">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    )
}

function ProviderDetail({ proveedor, onBack, onSuspend, onApprove }) {
    const isApproved = proveedor.estado === 'active'
    const isSuspended = proveedor.estado === 'suspended'

    const formatPrice = (price) =>
        price != null ? `ARS $${Number(price).toLocaleString('es-AR')}` : null

    return (
        <div className="prov-detalle">

            <div className="pd-header">
                <button className="btn-back-admin" onClick={onBack}>← Volver al Listado</button>
                <div>
                    <h1>{proveedor.businessName || `Solicitud #${proveedor.id}`}</h1>
                    <span className={`admin-badge ${proveedor.estado === 'active' ? 'badge-approved' :
                        proveedor.estado === 'suspended' ? 'badge-suspended' : 'badge-pending'}`}>
                        {proveedor.estado === 'active' ? '● Aprobado / Activo' :
                            proveedor.estado === 'suspended' ? '● Suspendido / Rechazado' :
                                '● Pendiente de aprobación'}
                    </span>
                </div>
            </div>

            <div className="pd-body">

                <div className="pd-left">

                    <div className="pd-card">
                        <h2>Datos de la Empresa</h2>
                        <div className="pd-info-grid">
                            <InfoItem label="Razón Social" value={proveedor.businessName} />
                            <InfoItem label="Responsable" value={proveedor.ownerName} />
                            <InfoItem label="Email" value={proveedor.email} />
                            <InfoItem label="Teléfono / WhatsApp" value={proveedor.phone} />
                            {proveedor.website && (
                                <div className="pd-info-item">
                                    <span>Sitio Web</span>
                                    <strong>
                                        <a href={proveedor.website} target="_blank" rel="noopener noreferrer">
                                            {proveedor.website}
                                        </a>
                                    </strong>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pd-card">
                        <h2>Rubro y Ubicación</h2>
                        <div className="pd-info-grid">
                            <InfoItem
                                label="Categoría"
                                value={CATEGORY_LABELS[proveedor.category] || proveedor.category}
                            />
                            <InfoItem label="Localidad / Provincia" value={proveedor.location} />
                            <InfoItem label="Dirección" value={proveedor.address} />
                        </div>
                        {proveedor.description && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#666' }}>Descripción del Negocio</span>
                                <p style={{ marginTop: '0.25rem', lineHeight: '1.6' }}>{proveedor.description}</p>
                            </div>
                        )}
                    </div>

                </div>

                <div className="pd-right">

                    <div className="pd-card">
                        <h2>Propuesta de Experiencia</h2>
                        <div className="pd-info-grid">
                            <InfoItem label="Nombre de la Experiencia" value={proveedor.experienceName} />
                            <InfoItem label="Precio Mínimo" value={formatPrice(proveedor.minPrice)} />
                            <InfoItem label="Precio Máximo" value={formatPrice(proveedor.maxPrice)} />
                            <InfoItem
                                label="Capacidad por turno"
                                value={proveedor.capacity != null ? `${proveedor.capacity} personas` : null}
                            />
                            <InfoItem label="Duración estimada" value={proveedor.duration} />
                        </div>
                        {proveedor.experienceDescription && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#666' }}>Detalle de la Experiencia</span>
                                <p style={{ marginTop: '0.25rem', lineHeight: '1.6' }}>{proveedor.experienceDescription}</p>
                            </div>
                        )}
                    </div>

                    <div className="pd-card pd-actions-card">
                        <h2>Acciones de Gestión</h2>
                        {isApproved ? (
                            <p style={{ marginTop: '1rem', color: '#2e7d32', fontWeight: '600' }}>
                                ✓ Esta solicitud ya fue aprobada.
                            </p>
                        ) : (
                            <div className="pd-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                                {isSuspended ? (
                                    <button
                                        className="btn-approve-prov"
                                        onClick={() => onApprove(proveedor.id)}
                                        style={{ width: '100%', padding: '10px', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        ✓ Reactivar Cuenta de Proveedor
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="btn-approve-prov"
                                            onClick={() => onApprove(proveedor.id)}
                                            style={{ width: '100%', padding: '10px', fontWeight: '600', cursor: 'pointer' }}
                                        >
                                            ✓ Aprobar Proveedor (Cambiar Rol)
                                        </button>
                                        <button
                                            className="btn-suspend-prov"
                                            onClick={() => onSuspend(proveedor.id)}
                                            style={{ width: '100%', padding: '10px', fontWeight: '600', backgroundColor: '#c62828', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            ⊘ Rechazar / Suspender Solicitud
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProviderDetail
