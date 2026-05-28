import './MyRequestsTab.css'

const mockRequests = [
    {
        id: 1,
        title: 'Cena Gourmet para Dos',
        category: 'Gastronomía',
        price: 149,
        submittedDate: '20 Oct 2024',
        status: 'approved'
    },
    {
        id: 2,
        title: 'Clase de Cocina Urbana',
        category: 'Gastronomía',
        price: 89,
        submittedDate: '24 Oct 2024',
        status: 'pending'
    },
    {
        id: 3,
        title: 'Retiro de Montaña',
        category: 'Aventura',
        price: 210,
        submittedDate: '15 Oct 2024',
        status: 'rejected'
    },
]

const statusConfig = {
    approved: { label: 'Aprobado — Paso 1', className: 'status-approved' },
    pending: { label: 'Pendiente de Revisión', className: 'status-pending' },
    rejected: { label: 'Rechazado', className: 'status-rejected' },
}

function MyRequestsTab({ onCompleteDetails }) {
    return (
        <div className="my-requests">
            <div className="tab-header">
                <h1>Mis Solicitudes de Cajas</h1>
                <p>Seguí el estado de cada propuesta enviada a BigBox.</p>
            </div>

            <div className="requests-table-wrapper">
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>Propuesta</th>
                            <th>Categoría</th>
                            <th>Precio Est.</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockRequests.map((req) => {
                            const status = statusConfig[req.status]
                            return (
                                <tr key={req.id}>
                                    <td className="req-title">{req.title}</td>
                                    <td>{req.category}</td>
                                    <td>${req.price}</td>
                                    <td>{req.submittedDate}</td>
                                    <td>
                                        <span className={`status-badge ${status.className}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td>
                                        {req.status === 'approved' ? (
                                            <button
                                                className="btn-complete"
                                                onClick={() => onCompleteDetails(req)}
                                            >
                                                Completar Detalles →
                                            </button>
                                        ) : (
                                            <span className="req-no-action">—</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyRequestsTab