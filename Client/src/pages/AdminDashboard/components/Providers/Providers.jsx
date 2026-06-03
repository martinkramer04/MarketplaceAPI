import './Providers.css'
import { useState } from 'react'
import ProviderDetail from '../ProviderDetail/ProviderDetail'
import mockProveedores from '../../../../data/Providers'

function Providers() {
    // El estado vive acá para que los cambios se reflejen en la tabla
    const [proveedores, setProveedores] = useState(mockProveedores)
    const [search, setSearch] = useState('')
    const [selectedProveedor, setSelectedProveedor] = useState(null)

    const filtered = proveedores.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.rubro.toLowerCase().includes(search.toLowerCase())
    )

    // Función que actualiza el estado en el array y en el proveedor seleccionado
    const handleSuspend = (id) => {
        const updated = proveedores.map((p) =>
            p.id === id ? { ...p, estado: 'suspended' } : p
        )
        setProveedores(updated)
        // Actualizamos también el proveedor que se está viendo en el detalle
        setSelectedProveedor((prev) => prev ? { ...prev, estado: 'suspended' } : prev)
    }

    const handleApprove = (id) => {
        const updated = proveedores.map((p) =>
            p.id === id ? { ...p, estado: 'active' } : p
        )
        setProveedores(updated)
        setSelectedProveedor((prev) => prev ? { ...prev, estado: 'active' } : prev)
    }

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
                <h1>Proveedores</h1>
                <p>Listado y gestión de empresas prestadoras de servicios en BigBox.</p>
            </div>

            <div className="prov-toolbar">
                <input
                    type="text"
                    placeholder="🔍 Buscar proveedor o rubro..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="prov-search"
                />
                <div className="prov-summary">
                    <span>{proveedores.filter(p => p.estado === 'active').length} activos</span>
                    <span>{proveedores.filter(p => p.estado === 'pending').length} pendientes</span>
                    <span>{proveedores.filter(p => p.estado === 'suspended').length} suspendidos</span>
                </div>
            </div>

            <div className="prov-table-wrapper">
                <table className="prov-table">
                    <thead>
                        <tr>
                            <th>Empresa</th>
                            <th>Rubro</th>
                            <th>Ciudad</th>
                            <th>Cajas Activas</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p) => (
                            <tr key={p.id}>
                                <td className="prov-nombre">{p.nombre}</td>
                                <td>{p.rubro}</td>
                                <td>{p.ciudad}</td>
                                <td className="prov-cajas">{p.cajas}</td>
                                <td>
                                    <span className={`admin-badge ${p.estado === 'active' ? 'badge-approved' :
                                            p.estado === 'suspended' ? 'badge-suspended' :
                                                'badge-pending'
                                        }`}>
                                        {p.estado === 'active' ? '● Activo' :
                                            p.estado === 'suspended' ? '● Suspendido' :
                                                '● Pendiente'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn-prov-detail"
                                        onClick={() => setSelectedProveedor(p)}
                                    >
                                        Ver detalle →
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