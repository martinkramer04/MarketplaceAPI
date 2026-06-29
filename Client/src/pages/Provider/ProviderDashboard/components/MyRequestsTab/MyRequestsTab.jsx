import './MyRequestsTab.css'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoxSolicitationsByProvider } from '../../../../../redux/boxSolicitationSlice'
import { fetchCurrentUser } from '../../../../../redux/userSlice'
import BoxSolicitationDetail from '../BoxSolicitationDetail/BoxSolicitationDetail'

const statusConfig = {
    PENDING:  { label: 'Pendiente de Revisión', className: 'status-pending' },
    APPROVED: { label: 'Aprobado',              className: 'status-approved' },
    REJECTED: { label: 'Rechazado',             className: 'status-rejected' },
}

function MyRequestsTab() {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.data)
    const { solicitations, loading, status: fetchStatus } = useSelector(state => state.boxSolicitations)
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        if (!user) dispatch(fetchCurrentUser())
    }, [user, dispatch])

    useEffect(() => {
        if (user?.id && fetchStatus === 'idle') {
            dispatch(fetchBoxSolicitationsByProvider(user.id))
        }
    }, [user, fetchStatus, dispatch])

    if (selected) {
        return <BoxSolicitationDetail solicitation={selected} onBack={() => setSelected(null)} />
    }

    if (loading && !solicitations.length) {
        return <div style={{ padding: '2rem' }}>Cargando tus solicitudes...</div>
    }

    return (
        <div className="my-requests">
            <div className="tab-header">
                <h1>Mis Solicitudes de Cajas</h1>
                <p>Hacé click en una fila para ver el detalle completo de la propuesta.</p>
            </div>

            <div className="requests-table-wrapper">
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Descripción breve</th>
                            <th>Precio</th>
                            <th>Fecha de Envío</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitations.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="perfil-no-orders" style={{ textAlign: 'center', padding: '2rem' }}>
                                    Aún no has enviado ninguna propuesta de caja.
                                </td>
                            </tr>
                        ) : (
                            solicitations.map((req) => {
                                const badge = statusConfig[req.status] || { label: req.status ?? '—', className: 'status-pending' }
                                return (
                                    <tr
                                        key={req.id}
                                        className="bsd-row-clickable"
                                        onClick={() => setSelected(req)}
                                    >
                                        <td className="req-id">#{req.id}</td>
                                        <td className="req-title">{req.title || '—'}</td>
                                        <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {req.shortDescription || '—'}
                                        </td>
                                        <td>
                                            {req.price != null
                                                ? `ARS $${Number(req.price).toLocaleString('es-AR')}`
                                                : '—'}
                                        </td>
                                        <td>
                                            {req.createdAt
                                                ? new Date(req.createdAt).toLocaleDateString('es-AR')
                                                : '—'}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${badge.className}`}>
                                                {badge.label}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyRequestsTab
