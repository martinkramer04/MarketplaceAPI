import './ProviderDetail.css'

function ProviderDetail({ proveedor, onBack, onSuspend, onApprove }) {

    const isSuspended = proveedor.estado === 'suspended'
    const isPending = proveedor.estado === 'pending'

    // 🟢 Evitamos errores de compilación si el objeto mapeado no cuenta con la lista de cajas
    const cajasPublicadas = proveedor.cajasPublicadas || [];

    return (
        <div className="prov-detalle">

            <div className="pd-header">
                <button className="btn-back-admin" onClick={onBack}>← Volver al Listado</button>
                <div>
                    <h1>Solicitud #{proveedor.id}</h1>
                    <span className={`admin-badge ${proveedor.estado === 'active' ? 'badge-approved' :
                        proveedor.estado === 'suspended' ? 'badge-suspended' :
                            'badge-pending'
                        }`}>
                        {proveedor.estado === 'active' ? '● Aprobado / Activo' :
                            proveedor.estado === 'suspended' ? '● Suspendido / Rechazado' :
                                '● Pendiente de aprobación'}
                    </span>
                </div>
            </div>

            <div className="pd-body">

                <div className="pd-left">
                    <div className="pd-card">
                        <h2>Datos de la Postulación</h2>
                        <div className="pd-info-grid">
                            <div className="pd-info-item">
                                <span>Identificador</span>
                                <strong>ID #{proveedor.id}</strong>
                            </div>
                            <div className="pd-info-item">
                                <span>Ciudad Base</span>
                                <strong>{proveedor.ciudad || 'Buenos Aires'}</strong>
                            </div>
                            <div className="pd-info-item">
                                <span>Rubro Propuesto</span>
                                <strong>{proveedor.rubro || 'General'}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="pd-card">
                        <h2>Formulario de Propuesta Consolidado</h2>
                        {/* 🟢 Renderizamos el texto completo que el usuario escribió en el Stepper */}
                        <p className="pd-description" style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                            {proveedor.descriptionFull}
                        </p>
                    </div>
                </div>

                <div className="pd-right">
                    <div className="pd-card">
                        <h2>Cajas Publicadas ({cajasPublicadas.length})</h2>
                        {cajasPublicadas.length === 0 ? (
                            <div className="pd-empty">
                                <span style={{ fontSize: '2rem' }}>📦</span>
                                <p>Las cajas se habilitarán una vez que el proveedor sea aprobado e ingrese a su portal.</p>
                            </div>
                        ) : (
                            <div className="pd-cajas-list">
                                {cajasPublicadas.map((caja) => (
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

                    {/* ACCIONES REALES CONECTADAS AL BACKEND */}
                    <div className="pd-card pd-actions-card">
                        <h2>Acciones de Gestión</h2>
                        <div className="pd-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                            {isPending && (
                                <button
                                    className="btn-approve-prov"
                                    onClick={() => onApprove(proveedor.id)}
                                    style={{ width: '100%', padding: '10px', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    ✓ Aprobar Proveedor (Cambiar Rol)
                                </button>
                            )}
                            {isSuspended ? (
                                <button
                                    className="btn-approve-prov"
                                    onClick={() => onApprove(proveedor.id)}
                                    style={{ width: '100%', padding: '10px', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    ✓ Reactivar Cuenta de Proveedor
                                </button>
                            ) : (
                                <button
                                    className="btn-suspend-prov"
                                    onClick={() => onSuspend(proveedor.id)}
                                    style={{ width: '100%', padding: '10px', fontWeight: '600', backgroundColor: '#c62828', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    ⊘ Rechazar / Suspender Solicitud
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProviderDetail