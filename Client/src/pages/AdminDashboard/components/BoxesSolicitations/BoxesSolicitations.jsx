import './BoxesSolicitations.css'
import { useState, useEffect } from 'react'

const mockProposals = [
    { id: 1, proveedor: 'Artisan Collective', titulo: 'Urban Cooking Class', categoria: 'Gastronomía', precio: 89, cajasPublicadas: 8, estado: 'pending' },
    { id: 2, proveedor: 'Zen Escapes', titulo: 'Mindful Mountain Retreat', categoria: 'Bienestar', precio: 210, cajasPublicadas: 12, estado: 'pending' },
    { id: 3, proveedor: 'AdventureX', titulo: 'Extreme Karting Weekend', categoria: 'Aventura', precio: 180, cajasPublicadas: 3, estado: 'pending' },
    { id: 4, proveedor: 'Coastal Crafts', titulo: 'Surf & Pottery Retreat', categoria: 'Bienestar', precio: 150, cajasPublicadas: 0, estado: 'pending' },
    { id: 5, proveedor: 'La Bodega Club', titulo: 'Wine Pairing Masterclass', categoria: 'Gastronomía', precio: 120, cajasPublicadas: 15, estado: 'pending' },
]

function BoxesSolicitations() {
    const [proposals, setProposals] = useState([])
    const [activeProposal, setActiveProposal] = useState(null)

    useEffect(() => {
        const sorted = [...mockProposals].sort(
            (a, b) => b.cajasPublicadas - a.cajasPublicadas
        )
        setProposals(sorted)
    }, [])

    const handleAction = (id, action) => {
        setProposals((prev) =>
            prev.map((p) => p.id === id ? { ...p, estado: action } : p)
        )
        setActiveProposal(null)
    }

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

                {/* TABLA */}
                <div className="propuestas-table-wrapper">
                    <table className="propuestas-table">
                        <thead>
                            <tr>
                                <th>Proveedor</th>
                                <th>Propuesta</th>
                                <th>Categoría</th>
                                <th>Precio Est.</th>
                                <th>Cajas Activas</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposals.map((p) => (
                                <tr
                                    key={p.id}
                                    className={activeProposal?.id === p.id ? 'row-selected' : ''}
                                    onClick={() => p.estado === 'pending' && setActiveProposal(p)}
                                >
                                    <td className="prop-proveedor">{p.proveedor}</td>
                                    <td>{p.titulo}</td>
                                    <td>{p.categoria}</td>
                                    <td>${p.precio}</td>
                                    <td>
                                        <span className={`cajas-badge ${p.cajasPublicadas > 5 ? 'high' : p.cajasPublicadas > 0 ? 'mid' : 'low'}`}>
                                            {p.cajasPublicadas} cajas
                                        </span>
                                    </td>
                                    <td>
                                        {p.estado === 'pending' && <span className="admin-badge badge-pending">Pendiente</span>}
                                        {p.estado === 'approved' && <span className="admin-badge badge-approved">✓ Aprobado</span>}
                                        {p.estado === 'rejected' && <span className="admin-badge badge-rejected">✗ Rechazado</span>}
                                    </td>
                                    <td>
                                        {p.estado === 'pending' && (
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
                            <h3>{activeProposal.titulo}</h3>
                            <button className="btn-close-detail" onClick={() => setActiveProposal(null)}>✕</button>
                        </div>
                        <div className="propuesta-detail-body">
                            <div className="pd-row">
                                <span>Proveedor</span>
                                <strong>{activeProposal.proveedor}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Categoría</span>
                                <strong>{activeProposal.categoria}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Precio Est.</span>
                                <strong>${activeProposal.precio}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Cajas Publicadas</span>
                                <strong>{activeProposal.cajasPublicadas}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Prioridad</span>
                                <strong className={activeProposal.cajasPublicadas > 5 ? 'priority-high' : 'priority-low'}>
                                    {activeProposal.cajasPublicadas > 5 ? '🔼 Alta' : '🔽 Baja'}
                                </strong>
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