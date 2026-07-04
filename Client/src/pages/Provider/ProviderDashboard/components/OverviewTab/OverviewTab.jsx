import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProviderDashboard } from '../../../../../redux/dashboardSlice'
import './OverviewTab.css'

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
    return <span className={`ov-status-chip ov-status-${variant}`}>{status || '—'}</span>
}

function OverviewTab({ onNavigate }) {
    const dispatch = useDispatch()
    const { provider: data, providerStatus: status, providerError: error } = useSelector((state) => state.dashboard)

    useEffect(() => {
        if (status === 'idle') dispatch(fetchProviderDashboard())
    }, [status, dispatch])

    if (status === 'loading' && !data) {
        return (
            <div className="overview">
                <p className="ov-loading">Cargando tu panel...</p>
            </div>
        )
    }

    if (status === 'failed' && !data) {
        return (
            <div className="overview">
                <p className="ov-error">
                    No se pudo cargar tu panel. {typeof error === 'string' ? error : 'Intentá de nuevo más tarde.'}
                </p>
            </div>
        )
    }

    if (!data) return null

    const revenueDelta =
        data.revenueLastMonth > 0
            ? ((data.revenueThisMonth - data.revenueLastMonth) / data.revenueLastMonth) * 100
            : null

    return (
        <div className="overview">
            <div className="overview-header">
                <h1>Vista General</h1>
                <p>Bienvenido al Portal de Proveedores de Boxify.</p>
            </div>

            {data.lowStockBoxes && data.lowStockBoxes.length > 0 && (
                <button className="ov-alert" onClick={() => onNavigate?.('active-boxes')}>
                    <span className="ov-alert-icon">⚠️</span>
                    <div className="ov-alert-text">
                        <strong>{data.lowStockBoxes.length} caja(s) con bajo stock</strong>
                        <p>{data.lowStockBoxes.map((b) => `${b.boxName} (${b.stock})`).join(' · ')}</p>
                    </div>
                    <span className="ov-alert-cta">Gestionar →</span>
                </button>
            )}

            <div className="overview-stats">
                <div className="stat-card">
                    <span className="stat-icon">💰</span>
                    <span className="stat-value">{currency(data.revenueThisMonth)}</span>
                    <span className="stat-label">Ingresos este mes</span>
                    {revenueDelta !== null && (
                        <span className={`stat-delta ${revenueDelta >= 0 ? 'positive' : 'negative'}`}>
                            {revenueDelta >= 0 ? '+' : ''}
                            {revenueDelta.toFixed(1)}% vs. mes anterior
                        </span>
                    )}
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🛍️</span>
                    <span className="stat-value">{data.totalOrders}</span>
                    <span className="stat-label">Órdenes confirmadas</span>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <span className="stat-value">{data.totalUnitsSold}</span>
                    <span className="stat-label">Unidades vendidas</span>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-value">{Number(data.averageRating || 0).toFixed(2)}</span>
                    <span className="stat-label">Calificación · {data.totalReviews} reseñas</span>
                </div>
            </div>

            <div className="overview-stats overview-stats-secondary">
                <div className="stat-card stat-card-compact">
                    <span className="stat-icon">🎁</span>
                    <span className="stat-value">{data.totalBoxes}</span>
                    <span className="stat-label">Cajas totales</span>
                    <div className="stat-breakdown">
                        <span className="ov-chip ov-chip-success">{data.approvedBoxes} aprob.</span>
                        <span className="ov-chip ov-chip-pending">{data.pendingBoxes} pend.</span>
                        <span className="ov-chip ov-chip-danger">{data.rejectedBoxes} rech.</span>
                    </div>
                </div>
                <div className="stat-card stat-card-compact">
                    <span className="stat-icon">🏷️</span>
                    <span className="stat-value">{data.totalProducts}</span>
                    <span className="stat-label">Productos publicados</span>
                </div>
                <div className="stat-card stat-card-compact">
                    <span className="stat-icon">📋</span>
                    <span className="stat-value">{data.pendingBoxSolicitations}</span>
                    <span className="stat-label">Solicitudes pendientes</span>
                    <div className="stat-breakdown">
                        <span className="ov-chip ov-chip-success">{data.approvedBoxSolicitations} aprob.</span>
                        <span className="ov-chip ov-chip-danger">{data.rejectedBoxSolicitations} rech.</span>
                    </div>
                </div>
                <div className="stat-card stat-card-compact">
                    <span className="stat-icon">📈</span>
                    <span className="stat-value">{currency(data.totalRevenue)}</span>
                    <span className="stat-label">Ingresos históricos</span>
                </div>
            </div>

            <div className="overview-bottom">
                <div className="ov-card">
                    <h2>Tus Cajas Más Vendidas</h2>
                    {!data.topSellingBoxes || data.topSellingBoxes.length === 0 ? (
                        <p className="ov-empty">Todavía no registrás ventas.</p>
                    ) : (
                        <div className="ov-ranking">
                            {data.topSellingBoxes.map((box, i) => (
                                <div key={box.boxId} className="ov-ranking-item">
                                    <span className="ov-ranking-position">#{i + 1}</span>
                                    <div className="ov-ranking-info">
                                        <strong>{box.boxName}</strong>
                                        <span>{box.unitsSold} unidades vendidas</span>
                                    </div>
                                    <span className="ov-ranking-revenue">{currency(box.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="ov-card">
                    <h2>Órdenes Recientes</h2>
                    {!data.recentOrders || data.recentOrders.length === 0 ? (
                        <p className="ov-empty">Todavía no tenés órdenes.</p>
                    ) : (
                        <table className="ov-table">
                            <thead>
                                <tr>
                                    <th>Comprador</th>
                                    <th>Caja</th>
                                    <th>Cant.</th>
                                    <th>Estado</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentOrders.map((order, i) => (
                                    <tr key={`${order.orderId}-${order.boxName}-${i}`}>
                                        <td>{order.buyerName}</td>
                                        <td>{order.boxName}</td>
                                        <td>{order.quantity}</td>
                                        <td><OrderStatusChip status={order.status} /></td>
                                        <td className="ov-table-amount">{currency(order.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="overview-actions">
                <div className="action-card" onClick={() => onNavigate?.('propose-box')}>
                    <span>＋</span>
                    <h3>Proponer Nueva Caja</h3>
                    <p>Presentá el concepto de tu experiencia para revisión.</p>
                </div>
                <div className="action-card" onClick={() => onNavigate?.('my-requests')}>
                    <span>📋</span>
                    <h3>Ver Mis Solicitudes</h3>
                    <p>Seguí el estado de tus propuestas enviadas.</p>
                </div>
                <div className="action-card" onClick={() => onNavigate?.('active-boxes')}>
                    <span>📦</span>
                    <h3>Cajas Publicadas</h3>
                    <p>Mirá las métricas de tus cajas activas en Boxify.</p>
                </div>
            </div>
        </div>
    )
}

export default OverviewTab
