import './MyRequestsTab.css'
import { useState, useEffect } from 'react'
import api from '../../../../../api/axiosConfig'

const statusConfig = {
    CONFIRMADA: { label: 'Aprobado', className: 'status-approved' },
    GENERADA: { label: 'Pendiente de Revisión', className: 'status-pending' },
    RECHAZADA: { label: 'Rechazado', className: 'status-rejected' },
}

function MyRequestsTab() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let currentUserId = null;

        // 1. Obtenemos de forma limpia quién está logueado
        api.get('/auth/me')
            .then((resUser) => {
                currentUserId = resUser.data.id;
                // 2. Traemos la lista completa autorizada para el entorno corporativo
                return api.get(`/api/provider-solicitations/provider/${currentUserId}`);
            })
            .then((resRequests) => {
                const misSolicitudes = resRequests.data;

                setRequests(misSolicitudes);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al cargar solicitudes del proveedor:", err);
                setLoading(false);
            })
    }, [])

    if (loading) return <div style={{ padding: '2rem' }}>Cargando tus solicitudes desde MySQL...</div>

    return (
        <div className="my-requests">
            <div className="tab-header">
                <h1>Mis Solicitudes de Cajas</h1>
                <p>Seguí en tiempo real el estado de cada propuesta enviada a BigBox.</p>
            </div>

            <div className="requests-table-wrapper">
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>ID Solicitud</th>
                            <th>Propuesta / Descripción</th>
                            <th>Fecha de Envío</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="perfil-no-orders" style={{ textAlign: 'center', padding: '2rem' }}>
                                    Aún no has enviado ninguna propuesta de caja.
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => {
                                const status = statusConfig[req.solicitationStatus] || { label: req.solicitationStatus, className: 'status-pending' }
                                return (
                                    <tr key={req.id}>
                                        <td className="req-id">#{req.id}</td>
                                        <td className="req-title" style={{ maxWidth: '400px', whiteSpace: 'pre-wrap' }}>
                                            {req.description}
                                        </td>
                                        <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}</td>
                                        <td>
                                            <span className={`status-badge ${status.className}`}>
                                                {status.label}
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

export default MyRequestsTab;