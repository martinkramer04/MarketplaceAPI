import './Proveedores.css'
import { useState } from 'react'

const mockProveedores = [
    { id: 1, nombre: 'La Bodega Club', rubro: 'Gastronomía', cajas: 15, estado: 'active', ciudad: 'Mendoza' },
    { id: 2, nombre: 'Zen Escapes', rubro: 'Bienestar', cajas: 12, estado: 'active', ciudad: 'Bariloche' },
    { id: 3, nombre: 'Artisan Collective', rubro: 'Gastronomía', cajas: 8, estado: 'active', ciudad: 'Buenos Aires' },
    { id: 4, nombre: 'AdventureX', rubro: 'Aventura', cajas: 3, estado: 'active', ciudad: 'Córdoba' },
    { id: 5, nombre: 'Coastal Crafts', rubro: 'Bienestar', cajas: 0, estado: 'pending', ciudad: 'Mar del Plata' },
]

function Proveedores() {
    const [search, setSearch] = useState('')

    const filtered = mockProveedores.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.rubro.toLowerCase().includes(search.toLowerCase())
    )

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
                                    <button className="btn-prov-detail">Ver detalle →</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default Proveedores