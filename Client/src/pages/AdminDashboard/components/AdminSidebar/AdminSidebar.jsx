import './AdminSidebar.css'

const navItems = [
    { key: 'vistaGeneral', icon: '▦', label: 'Vista General' },
    { key: 'propuestasCajas', icon: '📋', label: 'Propuestas de Cajas' },
    { key: 'boxes', icon: '🎁', label: 'Cajas Publicadas' },
    { key: 'cupones', icon: '🎟️', label: 'Cupones' },
    { key: 'ordenes', icon: '🛍️', label: 'Órdenes' },
    { key: 'proveedores', icon: '🏢', label: 'Proveedores' },
    { key: 'configuracionSistema', icon: '⚙️', label: 'Configuración' },
]

function AdminSidebar({ activeTab, onNavigate }) {
    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-brand">
                <span className="admin-sidebar-logo">Boxify</span>
                <span className="admin-sidebar-role">Management Console</span>
            </div>

            <nav className="admin-sidebar-nav">
                {navItems.map((item) => (
                    <button
                        key={item.key}
                        className={`admin-sidebar-item ${activeTab === item.key ? 'active' : ''}`}
                        onClick={() => onNavigate(item.key)}
                    >
                        <span className="admin-sidebar-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    )
}

export default AdminSidebar