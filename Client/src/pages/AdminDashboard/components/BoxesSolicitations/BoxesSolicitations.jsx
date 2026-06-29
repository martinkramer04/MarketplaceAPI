import './BoxesSolicitations.css'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoxSolicitations, updateBoxSolicitation } from '../../../../redux/boxSolicitationSlice'
import { fetchCategories } from '../../../../redux/categorySlice'
import { useToast } from '../../../../Context/ToastContext'
import StatusBadge from '../../../../components/StatusBadge/StatusBadge'
import { getItemImageUrl } from '../../../../utils/boxUtils'

const POLICY_LABELS = {
    strict:   'Estricta — Sin reembolso en 7 días',
    moderate: 'Moderada — Reembolso parcial',
    flexible: 'Flexible — Reembolso completo',
}

function BoxesSolicitations() {
    const dispatch = useDispatch()
    const { solicitations, loading, error, status: fetchStatus } = useSelector(state => state.boxSolicitations)
    const { items: categories, status: categoryStatus } = useSelector(state => state.categories)
    const [activeId, setActiveId] = useState(null)
    const toast = useToast()

    useEffect(() => {
        if (fetchStatus === 'idle') dispatch(fetchBoxSolicitations())
    }, [fetchStatus, dispatch])

    useEffect(() => {
        if (categoryStatus === 'idle') dispatch(fetchCategories())
    }, [categoryStatus, dispatch])

    const activeProposal = solicitations.find(s => s.id === activeId) ?? null

    const getCategoryName = (categoryId) => {
        const cat = categories.find(c => c.id === categoryId)
        return cat?.description || cat?.name || (categoryId ? `ID ${categoryId}` : '—')
    }

    const handleAction = async (id, action) => {
        const status = action === 'approved' ? 'APPROVED' : 'REJECTED'
        try {
            await dispatch(updateBoxSolicitation({ id, payload: { status } })).unwrap()
            toast.success(`Solicitud #${id} ${action === 'approved' ? 'aprobada' : 'rechazada'} correctamente.`)
        } catch (err) {
            toast.error(`Error: ${typeof err === 'string' ? err : err?.message || 'Error desconocido'}`)
        }
    }

    if (loading && !solicitations.length) return <p style={{ padding: '2rem' }}>Cargando propuestas...</p>
    if (error && !solicitations.length) return <p style={{ padding: '2rem', color: 'red' }}>{typeof error === 'string' ? error : 'No se pudieron cargar las propuestas.'}</p>

    return (
        <div className="propuestas">
            <div className="admin-tab-header">
                <h1>Propuestas de Cajas</h1>
                <p>Revisá y gestioná las propuestas de cajas enviadas por los proveedores.</p>
            </div>

            <div className="propuestas-body">
                <div className="propuestas-table-wrapper">
                    <table className="propuestas-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Categoría</th>
                                <th>Precio Est.</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitations.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                        No hay propuestas registradas.
                                    </td>
                                </tr>
                            ) : (
                                solicitations.map((p) => (
                                    <tr
                                        key={p.id}
                                        className={activeId === p.id ? 'row-selected' : ''}
                                        onClick={() => setActiveId(p.id === activeId ? null : p.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>#{p.id}</td>
                                        <td>{p.title || '—'}</td>
                                        <td>{getCategoryName(p.categoryId)}</td>
                                        <td>{p.price != null ? `ARS $${Number(p.price).toLocaleString('es-AR')}` : '—'}</td>
                                        <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-AR') : '—'}</td>
                                        <td><StatusBadge status={p.status} /></td>
                                        <td>
                                            {p.status === 'PENDING' && (
                                                <div className="prop-actions" onClick={(e) => e.stopPropagation()}>
                                                    <button className="btn-approve" onClick={() => handleAction(p.id, 'approved')}>
                                                        Aprobar
                                                    </button>
                                                    <button className="btn-reject" onClick={() => handleAction(p.id, 'rejected')}>
                                                        Rechazar
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {activeProposal && (
                    <div className="propuesta-detail">
                        <div className="propuesta-detail-header">
                            <h3>{activeProposal.title || `Solicitud #${activeProposal.id}`}</h3>
                            <button className="btn-close-detail" onClick={() => setActiveId(null)}>✕</button>
                        </div>

                        <div className="propuesta-detail-body">
                            <div className="pd-row">
                                <span>Estado</span>
                                <StatusBadge status={activeProposal.status} />
                            </div>
                            <div className="pd-row">
                                <span>Categoría</span>
                                <strong>{getCategoryName(activeProposal.categoryId)}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Precio Est.</span>
                                <strong>
                                    {activeProposal.price != null
                                        ? `ARS $${Number(activeProposal.price).toLocaleString('es-AR')}`
                                        : '—'}
                                </strong>
                            </div>
                            <div className="pd-row">
                                <span>Política de Cancelación</span>
                                <strong>{POLICY_LABELS[activeProposal.cancellationPolicy] || activeProposal.cancellationPolicy || '—'}</strong>
                            </div>
                            {activeProposal.subProviders && (
                                <div className="pd-row">
                                    <span>Sub-proveedores</span>
                                    <strong>{activeProposal.subProviders}</strong>
                                </div>
                            )}
                            <div className="pd-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                <span>Descripción Breve</span>
                                <p style={{ margin: 0, fontSize: '0.88rem', color: '#444', lineHeight: 1.5 }}>
                                    {activeProposal.shortDescription || '—'}
                                </p>
                            </div>
                            <div className="pd-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                <span>Descripción Detallada</span>
                                <p style={{ margin: 0, fontSize: '0.88rem', color: '#444', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                    {activeProposal.detailedDescription || '—'}
                                </p>
                            </div>
                            {activeProposal.images?.length > 0 && (
                                <div className="pd-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                                    <span>Imágenes ({activeProposal.images.length})</span>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {activeProposal.images.map(img => (
                                            <img
                                                key={img.id}
                                                src={getItemImageUrl({ images: [img] })}
                                                alt={img.name}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {activeProposal.status === 'PENDING' && (
                            <div className="propuesta-detail-actions">
                                <button className="btn-approve-full" onClick={() => handleAction(activeProposal.id, 'approved')}>
                                    Aprobar Propuesta
                                </button>
                                <button className="btn-reject-full" onClick={() => handleAction(activeProposal.id, 'rejected')}>
                                    Rechazar
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BoxesSolicitations
