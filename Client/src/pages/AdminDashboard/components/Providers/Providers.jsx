import './Providers.css'
import { useState } from 'react'
import ProveedorDetalle from '../ProviderDetail/ProviderDetail'
import mockProveedores from '../../../../data/Providers'


function Providers() {
    const [search, setSearch] = useState('')
    const [selectedProveedor, setSelectedProveedor] = useState(null)

    const filtered = mockProveedores.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.rubro.toLowerCase().includes(search.toLowerCase())
    )

    if (selectedProveedor) {
        return (
            <ProveedorDetalle
                proveedor={selectedProveedor}
                onBack={() => setSelectedProveedor(null)}
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
                    <span>{mockProveedores.filter(p => p.estado === 'active').length} activos</span>
                    <span>{mockProveedores.filter(p => p.estado === 'pending').length} pendientes</span>
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
                                    <span className={`admin-badge ${p.estado === 'active' ? 'badge-approved' : 'badge-pending'}`}>
                                        {p.estado === 'active' ? '● Activo' : '● Pendiente'}
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