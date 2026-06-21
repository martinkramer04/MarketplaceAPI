import './Providers.css'
import { useState, useEffect } from 'react'
import ProviderDetail from '../ProviderDetail/ProviderDetail'
import api from '../../../../api/axiosConfig'
import { useToast } from "../../../../Context/ToastContext"
import StatusBadge from '../../../../components/StatusBadge/StatusBadge'

function Providers() {
    const [proveedores, setProveedores] = useState([])
    const [search, setSearch] = useState('')
    const [selectedProveedor, setSelectedProveedor] = useState(null)
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    useEffect(() => {
        cargarSolicitudes()
    }, [])

    const cargarSolicitudes = () => {
        setLoading(true)
        api.get('/api/provider-solicitations')
            .then((res) => {
                const formateadas = res.data.map(s => ({
                    id: s.id,
                    nombre: `Solicitud #${s.id}`,
                    descriptionFull: s.description || 'Sin descripcion',
                    rubro: 'Ver Detalle',
                    ciudad: 'Buenos Aires',
                    cajas: 0,
                    estado: s.solicitationStatus === 'CONFIRMADA' ? 'active' :
                        s.solicitationStatus === 'RECHAZADA' ? 'suspended' : 'pending'
                }))
                setProveedores(formateadas)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error cargando solicitudes:', err)
                setLoading(false)
            })
    }

    const filtered = proveedores.filter((p) =>
        p.id.toString().includes(search) ||
        p.descriptionFull.toLowerCase().includes(search.toLowerCase())
    )

    const handleSuspend = (id) => {
        api.put(`/api/provider-solicitations/${id}`, { solicitationStatus: 'RECHAZADA', status: 'REJECTED' })
            .then(() => {
                setProveedores(prev => prev.map(p => p.id === id ? { ...p, estado: 'suspended' } : p))
                setSelectedProveedor(prev => prev ? { ...prev, estado: 'suspended' } : prev)
                toast.success(`Solicitud #${id} rechazada correctamente.`)
            })
            .catch(err => toast.error(`Error al suspender: ${err.response?.data?.message || err.message}`))
    }

    const handleApprove = (id) => {
        api.put(`/api/provider-solicitations/${id}`, { solicitationStatus: 'CONFIRMADA', status: 'APPROVED' })
            .then(() => {
                setProveedores(prev => prev.map(p => p.id === id ? { ...p, estado: 'active' } : p))
                setSelectedProveedor(prev => prev ? { ...prev, estado: 'active' } : prev)
                toast.success(`Solicitud #${id} aprobada con exito!`)
            })
            .catch(err => toast.error(`Error al aprobar: ${err.response?.data?.message || err.message}`))
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
                <p>Listado transaccional y gestion de postulaciones desde la base de datos MySQL.</p>
            </div>

            <div className="prov-toolbar">
                <input
                    type="text"
                    placeholder="Buscar por ID o texto de propuesta..."
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
                                <td><StatusBadge status={p.estado} /></td>
                                <td>
                                    <button className="btn-prov-detail" onClick={() => setSelectedProveedor(p)}>
                                        Evaluar Propuesta
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

export default Providers