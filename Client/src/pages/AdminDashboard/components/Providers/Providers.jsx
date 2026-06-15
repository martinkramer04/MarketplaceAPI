import './Providers.css'
import { useState, useEffect } from 'react'
import ProviderDetail from '../ProviderDetail/ProviderDetail'
import api from '../../../../api/axiosConfig' // 🟢 Axios centralizado

function Providers() {
    const [proveedores, setProveedores] = useState([]) // 💡 El estado se llama proveedores
    const [search, setSearch] = useState('')
    const [selectedProveedor, setSelectedProveedor] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const cargarSolicitudes = () => {
        setLoading(true);
        api.get('/api/provider-solicitations')
            .then((res) => {
                const formateadas = res.data.map(s => ({
                    id: s.id,
                    nombre: `Solicitud #${s.id}`,
                    descriptionFull: s.description || "Sin descripción",
                    rubro: "Ver Detalle",
                    ciudad: "Buenos Aires",
                    cajas: 0,
                    estado: s.solicitationStatus === 'CONFIRMADA' ? 'active' :
                        s.solicitationStatus === 'RECHAZADA' ? 'suspended' : 'pending'
                }));
                // 🟢 CORREGIDO: Ahora usa setProveedores (con la P correspondiente) de tu useState
                setProveedores(formateadas);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando solicitudes:", err);
                setLoading(false);
            });
    };

    const filtered = proveedores.filter((p) =>
        p.id.toString().includes(search) ||
        p.descriptionFull.toLowerCase().includes(search.toLowerCase())
    )

    const handleSuspend = (id) => {
        api.put(`/api/provider-solicitations/${id}`, { solicitationStatus: 'RECHAZADA' })
            .then(() => {
                const updated = proveedores.map((p) =>
                    p.id === id ? { ...p, estado: 'suspended' } : p
                )
                setProveedores(updated)
                setSelectedProveedor((prev) => prev ? { ...prev, estado: 'suspended' } : prev)
            })
            .catch(err => alert("Error al suspender: " + err.message));
    }

    const handleApprove = (id) => {
        api.put(`/api/provider-solicitations/${id}`, { solicitationStatus: 'CONFIRMADA' })
            .then(() => {
                const updated = proveedores.map((p) =>
                    p.id === id ? { ...p, estado: 'active' } : p
                )
                setProveedores(updated)
                setSelectedProveedor((prev) => prev ? { ...prev, estado: 'active' } : prev)
            })
            .catch(err => alert("Error al aprobar: " + err.message));
    }

    if (loading) return <div style={{ padding: '2rem' }}>Cargando solicitudes desde la base de datos...</div>

    if (selectedProveedor) {
        return (
            <ProviderDetail
                proveedor={selectedProveedor}
                onBack={() => setSelectedProveedor(null)}
                onSuspend={handleSuspend}
                onApprove={handleApprove}
            />
        )
    }

    return (
        <div className="proveedores">
            <div className="admin-tab-header">
                <h1>Solicitudes de Proveedores</h1>
                <p>Listado transaccional y gestión de postulaciones desde la base de datos MySQL.</p>
            </div>

            <div className="prov-toolbar">
                <input
                    type="text"
                    placeholder="🔍 Buscar por ID o texto de propuesta..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="prov-search"
                />
                <div className="prov-summary">
                    <span>{proveedores.filter(p => p.estado === 'active').length} aprobados</span>
                    <span>{proveedores.filter(p => p.estado === 'pending').length} pendientes</span>
                    <span>{proveedores.filter(p => p.estado === 'suspended').length} rechazados</span>
                </div>
            </div>

            <div className="prov-table-wrapper">
                <table className="prov-table">
                    <thead>
                        <tr>
                            <th>ID Solicitud</th>
                            <th>Extracto de Propuesta</th>
                            <th>Ciudad</th>
                            <th>Cajas</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p) => (
                            <tr key={p.id}>
                                <td className="prov-nombre">Solicitud #{p.id}</td>
                                <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {p.descriptionFull}
                                </td>
                                <td>{p.ciudad}</td>
                                <td className="prov-cajas">{p.cajas}</td>
                                <td>
                                    <span className={`admin-badge ${p.estado === 'active' ? 'badge-approved' :
                                        p.estado === 'suspended' ? 'badge-suspended' :
                                            'badge-pending'
                                        }`}>
                                        {p.estado === 'active' ? '● Aprobado' :
                                            p.estado === 'suspended' ? '● Rechazado' :
                                                '● Pendiente'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn-prov-detail"
                                        onClick={() => setSelectedProveedor(p)}
                                    >
                                        Evaluar Propuesta →
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Providers;