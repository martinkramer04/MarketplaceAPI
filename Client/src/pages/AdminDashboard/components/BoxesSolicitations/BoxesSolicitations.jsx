import './BoxesSolicitations.css'
import { useState, useEffect } from 'react'

function BoxesSolicitations() {
    const [proposals, setProposals] = useState([])
    const [activeProposal, setActiveProposal] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const token = localStorage.getItem('access_token')

    useEffect(() => {
        fetch('http://localhost:4002/api/boxes/status/PENDING', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar propuestas')
                return res.json()
            })
            .then(data => {
                setProposals(data)
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

        fetch(`http://localhost:4002/api/boxes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al actualizar propuesta')
                return res.json()
            })
            .then(() => {
                setProposals(prev =>
                    prev.map(p => p.id === id ? { ...p, status: status } : p)
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
                                <th>Categoría</th>
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
                                    <td>
                                        {p.status === 'PENDING' && <span className="admin-badge badge-pending">Pendiente</span>}
                                        {p.status === 'APPROVED' && <span className="admin-badge badge-approved">✓ Aprobado</span>}
                                        {p.status === 'REJECTED' && <span className="admin-badge badge-rejected">✗ Rechazado</span>}
                                    </td>
                                    <td>
                                        {p.status === 'PENDING' && (
                                            <div className="prop-actions" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn-approve" onClick={() => handleAction(p.id, 'approved')}>
                                                    ✓ Aprobar
                                                </button>
                                                <button className="btn-reject" onClick={() => handleAction(p.id, 'rejected')}>
                                                    ✗ Rechazar
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
                                <span>Categoría</span>
                                <strong>{activeProposal.category?.name}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Precio Est.</span>
                                <strong>${activeProposal.price}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Descripción</span>
                                <strong>{activeProposal.description}</strong>
                            </div>
                        </div>
                        <div className="propuesta-detail-actions">
                            <button className="btn-approve-full" onClick={() => handleAction(activeProposal.id, 'approved')}>
                                ✓ Aprobar Propuesta
                            </button>
                            <button className="btn-reject-full" onClick={() => handleAction(activeProposal.id, 'rejected')}>
                                ✗ Rechazar
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default BoxesSolicitations