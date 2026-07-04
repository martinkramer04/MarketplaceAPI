import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminDashboard } from '../../../../redux/dashboardSlice'
import './GeneralView.css'

const currency = (value) =>
    `ARS $${Number(value || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`

const ORDER_STATUS_VARIANT = {
    CONFIRMADA: 'success',
    GENERADA: 'pending',
    PROCESO_PAGO: 'pending',
    RECHAZADA: 'danger',
    CANCELADA: 'danger',
}

function OrderStatusChip({ status }) {
    const variant = ORDER_STATUS_VARIANT[status] || 'pending'
    return <span className={`vg-status-chip vg-status-${variant}`}>{status || '—'}</span>
}

function GeneralView({ onNavigate }) {
    const dispatch = useDispatch()
    const { admin: data, adminStatus: status, adminError: error } = useSelector((state) => state.dashboard)

    useEffect(() => {
        if (status === 'idle') dispatch(fetchAdminDashboard())
    }, [status, dispatch])

    if (status === 'loading' && !data) {
        return (
            <div className="vista-general">
                <p className="vg-loading">Cargando panel de administración...</p>
            </div>
        )
    }

    if (status === 'failed' && !data) {
        return (
            <div className="vista-general">
                <p className="vg-error">
                    No se pudo cargar el panel. {typeof error === 'string' ? error : 'Intentá de nuevo más tarde.'}
                </p>
            </div>
        )
    }

    if (!data) return null

    const revenueDelta =
        data.revenueLastMonth > 0
            ? ((data.revenueThisMonth - data.revenueLastMonth) / data.revenueLastMonth) * 100
            : null

    const pendingApprovals = (data.pendingProviderSolicitations || 0) + (data.pendingBoxSolicitations || 0)

    return (
        <div className="vista-general">

            <div className="vg-header">
                <div>
                    <h1>Boxify Dashboard</h1>
                    <p>Bienvenido. Gestioná el ecosistema de experiencias premium.</p>
                </div>
                <div className="vg-date">
                    {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>

            {pendingApprovals > 0 && (
                <button className="vg-alert" onClick={() => onNavigate?.('propuestasCajas')}>
                    <span className="vg-alert-icon">⏳</span>
                    <div className="vg-alert-text">
                        <strong>
                            {pendingApprovals} solicitud{pendingApprovals !== 1 ? 'es' : ''} pendiente
                            {pendingApprovals !== 1 ? 's' : ''} de revisión
                        </strong>
                        <p>
                            {data.pendingProviderSolicitations} proveedor(es) y {data.pendingBoxSolicitations} caja(s)
                            esperando aprobación.
                        </p>
                    </div>
                    <span className="vg-alert-cta">Revisar →</span>
                </button>
            )}

            {/* KPIs principales */}
            <div className="vg-kpis">
                <div className="vg-kpi-card">
                    <div className="vg-kpi-top">
                        <span className="vg-kpi-icon">💰</span>
                        {revenueDelta !== null && (
                            <span className={`vg-kpi-delta ${revenueDelta >= 0 ? 'positive' : 'negative'}`}>
                                {revenueDelta >= 0 ? '+' : ''}
                                {revenueDelta.toFixed(1)}%
                            </span>
                        )}
                    </div>
                    <span className="vg-kpi-value">{currency(data.revenueThisMonth)}</span>
                    <span className="vg-kpi-label">Ingresos este mes</span>
                </div>

                <div className="vg-kpi-card">
                    <div className="vg-kpi-top">
                        <span className="vg-kpi-icon">🛍️</span>
                    </div>
                    <span className="vg-kpi-value">{data.totalOrders}</span>
                    <span className="vg-kpi-label">Órdenes totales</span>
                    <div className="vg-kpi-breakdown">
                        <span className="vg-chip vg-chip-success">{data.confirmedOrders} confirmadas</span>
                        <span className="vg-chip vg-chip-pending">{data.pendingOrders} pendientes</span>
                        <span className="vg-chip vg-chip-danger">{data.rejectedOrders} rechazadas</span>
                    </div>
                </div>

                <div className="vg-kpi-card">
                    <div className="vg-kpi-top">
                        <span className="vg-kpi-icon">👥</span>
                    </div>
                    <span className="vg-kpi-value">{data.totalUsers}</span>
                    <span className="vg-kpi-label">Usuarios registrados</span>
                    <div className="vg-kpi-breakdown">
                        <span className="vg-chip">{data.totalProviders} proveedores</span>
                        <span className="vg-chip">{data.totalAdmins} admins</span>
                    </div>
                </div>

                <div className="vg-kpi-card">
                    <div className="vg-kpi-top">
                        <span className="vg-kpi-icon">⭐</span>
                    </div>
                    <span className="vg-kpi-value">{Number(data.averageRating || 0).toFixed(2)}</span>
                    <span className="vg-kpi-label">Calificación promedio · {data.totalReviews} reseñas</span>
                </div>
            </div>

            {/* KPIs secundarios */}
            <div className="vg-kpis vg-kpis-secondary">
                <div className="vg-kpi-card vg-kpi-compact">
                    <span className="vg-kpi-icon">📦</span>
                    <span className="vg-kpi-value">{data.totalBoxes}</span>
                    <span className="vg-kpi-label">Cajas totales</span>
                    <div className="vg-kpi-breakdown">
                        <span className="vg-chip vg-chip-success">{data.approvedBoxes} aprob.</span>
                        <span className="vg-chip vg-chip-pending">{data.pendingBoxes} pend.</span>
                        <span className="vg-chip vg-chip-danger">{data.rejectedBoxes} rech.</span>
                    </div>
                </div>

                <div className="vg-kpi-card vg-kpi-compact">
                    <span className="vg-kpi-icon">🏷️</span>
                    <span className="vg-kpi-value">{data.totalProducts}</span>
                    <span className="vg-kpi-label">Productos · {data.totalCategories} categorías</span>
                </div>

                <div className="vg-kpi-card vg-kpi-compact">
                    <span className="vg-kpi-icon">🎟️</span>
                    <span className="vg-kpi-value">{data.activeDiscounts}</span>
                    <span className="vg-kpi-label">Cupones activos</span>
                </div>

                <div className="vg-kpi-card vg-kpi-compact">
                    <span className="vg-kpi-icon">📈</span>
                    <span className="vg-kpi-value">{currency(data.totalRevenue)}</span>
                    <span className="vg-kpi-label">Ingresos históricos</span>
                </div>
            </div>

            <div className="vg-bottom">

                {/* TOP SELLING BOXES */}
                <div className="vg-card">
                    <h2>Cajas Más Vendidas</h2>
                    {!data.topSellingBoxes || data.topSellingBoxes.length === 0 ? (
                        <p className="vg-empty">Todavía no hay ventas registradas.</p>
                    ) : (
                        <div className="vg-ranking">
                            {data.topSellingBoxes.map((box, i) => (
                                <div key={box.boxId} className="vg-ranking-item">
                                    <span className="vg-ranking-position">#{i + 1}</span>
                                    <div className="vg-ranking-info">
                                        <strong>{box.boxName}</strong>
                                        <span>{box.unitsSold} unidades vendidas</span>
                                    </div>
                                    <span className="vg-ranking-revenue">{currency(box.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RECENT ORDERS */}
                <div className="vg-card">
                    <h2>Órdenes Recientes</h2>
                    {!data.recentOrders || data.recentOrders.length === 0 ? (
                        <p className="vg-empty">Todavía no hay órdenes registradas.</p>
                    ) : (
                        <table className="vg-table">
                            <thead>
                                <tr>
                                    <th>Orden</th>
                                    <th>Comprador</th>
                                    <th>Estado</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentOrders.map((order) => (
                                    <tr key={order.orderId}>
                                        <td>#{order.orderId}</td>
                                        <td>{order.buyerName}</td>
                                        <td><OrderStatusChip status={order.status} /></td>
                                        <td className="vg-table-amount">{currency(order.totalAmount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GeneralView
