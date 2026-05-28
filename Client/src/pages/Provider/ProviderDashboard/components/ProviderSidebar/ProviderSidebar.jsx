import './ProviderSidebar.css'

const navItems = [
    { key: 'overview', icon: '▦', label: 'Vista General' },
    { key: 'my-requests', icon: '📋', label: 'Mis Solicitudes' },
    { key: 'propose-box', icon: '＋', label: 'Proponer Nueva Caja' },
    { key: 'active-boxes', icon: '🟢', label: 'Cajas Publicadas' },
]

function ProviderSidebar({ activeTab, onNavigate }) {
    return (
        <aside className="provider-sidebar">
            <div className="sidebar-brand">
                <span className="sidebar-logo">BigBox</span>
                <span className="sidebar-role">Portal de Proveedores</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <button
                        key={item.key}
                        className={`sidebar-item ${activeTab === item.key ? 'active' : ''}`}
                        onClick={() => onNavigate(item.key)}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">PP</div>
                    <div>
                        <p className="sidebar-user-name">Premium Partner</p>
                        <p className="sidebar-user-id">ID: PRV-0042</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default ProviderSidebar