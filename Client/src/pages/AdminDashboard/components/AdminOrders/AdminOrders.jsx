import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../../../../redux/orderSlice';
import './AdminOrders.css';

function AdminOrders() {
    const dispatch = useDispatch();
    // Tu orderSlice expone la lista como 'orders' adentro de state.orders
    const { orders, loading, error, status: fetchStatus } = useSelector((state) => state.orders);

    useEffect(() => {
        if (fetchStatus === 'idle') dispatch(fetchOrders());
    }, [fetchStatus, dispatch]);

    if (loading && (!orders || !orders.length)) return <p style={{ padding: '2rem' }}>Cargando historial...</p>;
    if (error && (!orders || !orders.length)) return <p style={{ padding: '2rem', color: 'red' }}>Error: {error}</p>;

    return (
        <div className="propuestas">
            <div className="admin-tab-header">
                <h1>Historial de Órdenes</h1>
                <p>Monitoreá las compras y transacciones realizadas por los usuarios.</p>
            </div>
            <div className="propuestas-body">
                <div className="propuestas-table-wrapper" style={{ width: '100%' }}>
                    <table className="propuestas-table">
                        <thead>
                            <tr>
                                <th>ID Orden</th>
                                <th>Fecha</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!orders || orders.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                        No se registran órdenes en el sistema.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-AR') : '—'}</td>
                                        <td><strong>ARS ${Number(order.totalAmount || order.total).toLocaleString('es-AR')}</strong></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminOrders;