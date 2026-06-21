import './BoxesSolicitations.css'
import { useState, useEffect } from 'react'
import api from '../../../../api/axiosConfig'
import StatusBadge from '../../../../components/StatusBadge/StatusBadge'

function BoxesSolicitations() {
    const [proposals, setProposals] = useState([])
    const [activeProposal, setActiveProposal] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        api.get('/api/boxes/status/PENDING')
            .then(res => {
                setProposals(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setError('No se pudieron cargar las propuestas.')
                setLoading(false)
            })
    }, [])

    const handleAction = (id, action) => {
        const status = action === 'approved' ? 'APPROVED' : 'REJECTED'

        api.put(`/api/boxes/${id}`, { status })
            .then(() => {
                setProposals(prev =>
                    prev.map(p => p.id === id ? { ...p, status } : p)
                )
                setActiveProposal(null)
            })
            .catch(err => console.error(err))
    }

    if (loading) return <p>Cargando propuestas...</p>
    if (error) return <p>{error}</p>

    return (
        <div className="propuestas">
            <div className="admin-tab-header">
                <h1>Propuestas de Cajas</h1>
                <p>
                    Las propuestas se ordenan por trayectoria del proveedor —
                    mayor cantidad de cajas publicadas aparece primero.
                </p>
            </div>

            <div className="propuestas-body">
                <div className="propuestas-table-wrapper">
                    <table className="propuestas-table">
                        <thead>
                            <tr>
                                <th>Propuesta</th>
                                <th>Categoria</th>
                                <th>Precio Est.</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposals.map((p) => (
                                <tr
                                    key={p.id}
                                    className={activeProposal?.id === p.id ? 'row-selected' : ''}
                                    onClick={() => p.status === 'PENDING' && setActiveProposal(p)}
                                >
                                    <td>{p.name}</td>
                                    <td>{p.category?.name}</td>
                                    <td>${p.price}</td>
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {activeProposal && (
                    <div className="propuesta-detail">
                        <div className="propuesta-detail-header">
                            <h3>{activeProposal.name}</h3>
                            <button className="btn-close-detail" onClick={() => setActiveProposal(null)}>✕</button>
                        </div>
                        <div className="propuesta-detail-body">
                            <div className="pd-row">
                                <span>Categoria</span>
                                <strong>{activeProposal.category?.name}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Precio Est.</span>
                                <strong>${activeProposal.price}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Descripcion</span>
                                <strong>{activeProposal.description}</strong>
                            </div>
                        </div>
                        <div className="propuesta-detail-actions">
                            <button className="btn-approve-full" onClick={() => handleAction(activeProposal.id, 'approved')}>
                                Aprobar Propuesta
                            </button>
                            <button className="btn-reject-full" onClick={() => handleAction(activeProposal.id, 'rejected')}>
                                Rechazar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BoxesSolicitations