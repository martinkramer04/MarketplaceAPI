import './OverviewTab.css'

const stats = [
    { label: 'Solicitudes Enviadas', value: '7', icon: '📋' },
    { label: 'Aprobadas', value: '3', icon: '✅' },
    { label: 'Cajas Publicadas', value: '2', icon: '📦' },
    { label: 'Activaciones Totales', value: '154', icon: '⚡' },
]

function OverviewTab({ onNavigate }) {
    return (
        <div className="overview">
            <div className="overview-header">
                <h1>Vista General</h1>
                <p>Bienvenido al Portal de Proveedores de Boxify.</p>
            </div>

            <div className="overview-stats">
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-card">
                        <span className="stat-icon">{stat.icon}</span>
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                    </div>
                ))}
            </div>

            <div className="overview-actions">
                <div className="action-card" onClick={() => onNavigate('propose-box')}>
                    <span>＋</span>
                    <h3>Proponer Nueva Caja</h3>
                    <p>Presentá el concepto de tu experiencia para revisión.</p>
                </div>
                <div className="action-card" onClick={() => onNavigate('my-requests')}>
                    <span>📋</span>
                    <h3>Ver Mis Solicitudes</h3>
                    <p>Seguí el estado de tus propuestas enviadas.</p>
                </div>
                <div className="action-card" onClick={() => onNavigate('active-boxes')}>
                    <span>📦</span>
                    <h3>Cajas Publicadas</h3>
                    <p>Mirá las métricas de tus cajas activas en Boxify.</p>
                </div>
            </div>
        </div>
    )
}

export default OverviewTab