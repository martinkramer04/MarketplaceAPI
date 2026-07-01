import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../../../redux/orderSlice";
import "./AdminOrders.css";

function AdminOrders() {
  const dispatch = useDispatch();

  const {
    orders,
    loading,
    error,
    status: fetchStatus,
  } = useSelector((state) => state.orders);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (fetchStatus === "idle") dispatch(fetchOrders());
  }, [fetchStatus, dispatch]);

  const activeOrder = orders.find((o) => o.id === activeId) ?? null;

  if (loading && (!orders || !orders.length) && !activeId)
    return <p className="orders-loading">Cargando historial...</p>;
  if (error && (!orders || !orders.length))
    return <p className="orders-error">Error: {error}</p>;

  return (
    <div className="propuestas">
      <div className="admin-tab-header">
        <h1>Historial de Órdenes</h1>
        <p>
          Monitoreá las transacciones comerciales, clientes y desglose de
          productos vendidos en la plataforma.
        </p>
      </div>

      <div className="propuestas-body">
        {/* TABLA PRINCIPAL */}
        <div className={`propuestas-table-container ${activeOrder ? "split-view" : "full-view"}`}>
          <div className="propuestas-table-wrapper">
            <table className="propuestas-table">
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Titular</th>
                  <th>Estado</th>
                  <th>Total Cobrado</th>
                </tr>
              </thead>
              <tbody>
                {!orders || orders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="table-empty-message">
                      No se registran órdenes en el sistema.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className={`table-row-clickable ${activeId === order.id ? "row-selected" : ""}`}
                      onClick={() =>
                        setActiveId(order.id === activeId ? null : order.id)
                      }
                    >
                      <td>#{order.id}</td>
                      <td>
                        <strong className="user-name">
                          {order.user
                            ? `${order.user.firstname || ""} ${order.user.lastname || ""}`.trim()
                            : "—"}
                        </strong>
                        <br />
                        <span className="user-email">
                          {order.user?.email || ""}
                        </span>
                      </td>
                      <td>
                        <span className="order-status-badge">
                          {order.status || "—"}
                        </span>
                      </td>
                      <td>
                        <strong className="order-total-amount">
                          ARS $
                          {Number(order.totalAmount || 0).toLocaleString(
                            "es-AR",
                          )}
                        </strong>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PANEL DETALLE LATERAL */}
        {activeOrder && (
          <div className="propuesta-detail">
            <div className="propuesta-detail-header">
              <h3>Resumen de Orden #{activeOrder.id}</h3>
              <button
                className="btn-close-detail"
                onClick={() => setActiveId(null)}
              >
                ✕
              </button>
            </div>

            <div className="propuesta-detail-body">
              <h4 className="detail-section-title">Datos de la Orden</h4>
              <div className="pd-row">
                <span>Comprador</span>
                <strong>
                  {activeOrder.user
                    ? `${activeOrder.user.firstname || ""} ${activeOrder.user.lastname || ""}`.trim()
                    : "—"}
                </strong>
              </div>
              <div className="pd-row">
                <span>Email</span>
                <strong>{activeOrder.user?.email || "—"}</strong>
              </div>
              <div className="pd-row">
                <span>Estado</span>
                <strong>{activeOrder.status || "—"}</strong>
              </div>
              {activeOrder.discountCode && (
                <div className="pd-row">
                  <span>Cupón Aplicado</span>
                  <code className="discount-tag">
                    {activeOrder.discountCode} (-
                    {activeOrder.discountPercentage}%)
                  </code>
                </div>
              )}

              <h4 className="detail-section-title spacing-top">Cajas Adquiridas</h4>

              {!activeOrder.orderDetails ||
                activeOrder.orderDetails.length === 0 ? (
                <p className="detail-empty-message">Sin detalles de cajas.</p>
              ) : (
                <div className="detail-cards-list">
                  {activeOrder.orderDetails.map((detail, i) => {
                    const unitPrice = Number(detail.unitPrice || 0);
                    const qty = Number(detail.quantity || 1);
                    const subtotal = Number(detail.subtotal || unitPrice * qty);

                    return (
                      <div key={i} className="detail-card-item">
                        <div className="card-item-info">
                          <span className="box-name">
                            {detail.boxName ||
                              detail.box?.name ||
                              "Caja Especial"}
                          </span>
                          <span className="box-qty-price">
                            {qty} u. × ARS ${unitPrice.toLocaleString("es-AR")}
                          </span>
                          {detail.discountAmount > 0 && (
                            <span className="box-discount-amount">
                              Descuento: -ARS $
                              {Number(detail.discountAmount).toLocaleString(
                                "es-AR",
                              )}
                            </span>
                          )}
                        </div>
                        <div className="card-item-subtotal">
                          <span className="subtotal-amount">
                            ARS ${subtotal.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="propuesta-detail-footer">
              <span className="footer-label">Monto Neto Facturado:</span>
              <span className="footer-amount">
                ARS $
                {Number(activeOrder.totalAmount || 0).toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;