import './BoxSolicitationDetail.css'
import '../CompleteDetailsTab/CompleteDetailsTab.css'
import '../MyRequestsTab/MyRequestsTab.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '../../../../../redux/categorySlice'
import { getItemImageUrl } from '../../../../../utils/boxUtils'

const STATUS_CONFIG = {
    PENDING:  { label: 'Pendiente de Revisión', className: 'status-pending' },
    APPROVED: { label: 'Aprobado',              className: 'status-approved' },
    REJECTED: { label: 'Rechazado',             className: 'status-rejected' },
}

const POLICY_CONFIG = {
    strict:   { label: 'Estricta — Sin reembolso en 7 días', className: 'policy-strict' },
    moderate: { label: 'Moderada — Reembolso parcial',       className: 'policy-moderate' },
    flexible: { label: 'Flexible — Reembolso completo',      className: 'policy-flexible' },
}

function Field({ label, value }) {
    if (value == null || value === '') return null
    return (
        <div className="bsd-field">
            <span className="bsd-field-label">{label}</span>
            <span className="bsd-field-value">{value}</span>
        </div>
    )
}

function BoxSolicitationDetail({ solicitation, onBack }) {
    const dispatch = useDispatch()
    const { items: categories, status: categoryStatus } = useSelector(state => state.categories)

    useEffect(() => {
        if (categoryStatus === 'idle') dispatch(fetchCategories())
    }, [categoryStatus, dispatch])

    const category = categories.find(c => c.id === solicitation.categoryId)
    const status = STATUS_CONFIG[solicitation.status] ?? { label: solicitation.status ?? '—', className: 'status-pending' }
    const policy = POLICY_CONFIG[solicitation.cancellationPolicy]
    const images = solicitation.images ?? []

    return (
        <div className="bsd-container">

            <div className="bsd-header">
                <button className="btn-back-tab" onClick={onBack}>← Volver</button>
                <div className="bsd-header-info">
                    <h1>{solicitation.title || `Solicitud #${solicitation.id}`}</h1>
                    <span className={`status-badge ${status.className}`}>
                        {status.label}
                    </span>
                </div>
            </div>

            <div className="cd-body">

                <div className="cd-left">

                    <div className="cd-section">
                        <h2>Información General</h2>
                        <div className="bsd-info-grid">
                            <Field label="ID Solicitud" value={`#${solicitation.id}`} />
                            <Field
                                label="Precio"
                                value={solicitation.price != null
                                    ? `ARS $${Number(solicitation.price).toLocaleString('es-AR')}`
                                    : null}
                            />
                            <Field
                                label="Categoría"
                                value={category?.description || category?.name || (solicitation.categoryId ? `ID ${solicitation.categoryId}` : null)}
                            />
                            <Field
                                label="Fecha de Envío"
                                value={solicitation.createdAt
                                    ? new Date(solicitation.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
                                    : null}
                            />
                        </div>

                        {policy && (
                            <div className="bsd-field" style={{ marginTop: '4px' }}>
                                <span className="bsd-field-label">Política de Cancelación</span>
                                <span>
                                    <span className={`policy-badge ${policy.className}`}>{policy.label}</span>
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="cd-section">
                        <h2>Descripción Breve</h2>
                        <p className="bsd-prose">{solicitation.shortDescription || '—'}</p>
                    </div>

                    <div className="cd-section">
                        <h2>Descripción Detallada</h2>
                        <p className="bsd-prose">{solicitation.detailedDescription || '—'}</p>
                    </div>

                </div>

                <div className="cd-right">

                    {solicitation.subProviders && (
                        <div className="cd-section">
                            <h2>Sub-proveedores</h2>
                            <p className="bsd-prose">{solicitation.subProviders}</p>
                        </div>
                    )}

                    <div className="cd-section">
                        <h2>Imágenes</h2>
                        {images.length === 0 ? (
                            <p className="bsd-empty-images">No se adjuntaron imágenes a esta solicitud.</p>
                        ) : (
                            <div className="bsd-image-grid">
                                {images.map((img) => (
                                    <div key={img.id} className="bsd-image-slot">
                                        <img src={getItemImageUrl({ images: [img] })} alt={img.name} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BoxSolicitationDetail
