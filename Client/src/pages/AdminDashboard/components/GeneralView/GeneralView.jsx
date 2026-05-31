import './GeneralView.css'

const kpis = [
    { label: 'Ventas Totales', value: '$1.482.900', delta: '+12%', icon: '💰', positive: true },
    { label: 'Usuarios Activos', value: '24.512', delta: '+8%', icon: '👥', positive: true },
    { label: 'Aprobaciones Pend.', value: '38', delta: '', icon: '📋', positive: null },
    { label: 'Cajas Publicadas', value: '147', delta: '+3%', icon: '📦', positive: true },
]

const quickLogs = [
    { time: '14:02', text: 'Nuevo proveedor "Coastal Crafts" aplicó para revisión.' },
    { time: '13:49', text: 'Auditoría de seguridad automática completada — 0 amenazas.' },
    { time: '12:30', text: 'Box "Tech Gadget 2024" publicado por Admin Thompson.' },
]

const systemHealth = [
    { label: 'API Response Time', value: 104, unit: 'ms' },
    { label: 'Storage Capacity', value: 62, unit: '%' },
]

function GeneralView() {
    return (
        <div className="vista-general">

            <div className="vg-header">
                <div>
                    <h1>BigBox Dashboard</h1>
                    <p>Bienvenido. Gestioná el ecosistema de experiencias premium.</p>
                </div>
                <div className="vg-date">
                    {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* KPIs */}
            <div className="vg-kpis">
                {kpis.map((kpi) => (
                    <div key={kpi.label} className="vg-kpi-card">
                        <div className="vg-kpi-top">
                            <span className="vg-kpi-icon">{kpi.icon}</span>
                            {kpi.delta && (
                                <span className={`vg-kpi-delta ${kpi.positive ? 'positive' : 'negative'}`}>
                                    {kpi.delta}
                                </span>
                            )}
                        </div>
                        <span className="vg-kpi-value">{kpi.value}</span>
                        <span className="vg-kpi-label">{kpi.label}</span>
                    </div>
                ))}
            </div>

            <div className="vg-bottom">

                {/* SYSTEM HEALTH */}
                <div className="vg-card">
                    <h2>Estado del Sistema</h2>
                    {systemHealth.map((item) => (
                        <div key={item.label} className="vg-health-item">
                            <div className="vg-health-labels">
                                <span>{item.label}</span>
                                <span className="vg-health-value">{item.value}{item.unit}</span>
                            </div>
                            <div className="vg-health-bar">
                                <div
                                    className="vg-health-fill"
                                    style={{
                                        width: `${item.unit === '%' ? item.value : Math.min(item.value / 2, 100)}%`,
                                        backgroundColor: item.value > 80 ? '#C0392B' : 'var(--a-accent)'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* QUICK LOGS */}
                <div className="vg-card">
                    <h2>Registro de Actividad</h2>
                    <div className="vg-logs">
                        {quickLogs.map((log, i) => (
                            <div key={i} className="vg-log-item">
                                <span className="vg-log-time">{log.time}</span>
                                <span className="vg-log-text">{log.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default GeneralView