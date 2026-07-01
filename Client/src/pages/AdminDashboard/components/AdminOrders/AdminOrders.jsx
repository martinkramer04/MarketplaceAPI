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
    return <p style={{ padding: "2rem" }}>Cargando historial...</p>;
  if (error && (!orders || !orders.length))
    return <p style={{ padding: "2rem", color: "red" }}>Error: {error}</p>;

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
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            maxWidth: activeOrder ? "60%" : "100%",
            transition: "all 0.3s ease",
          }}
        >
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
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#888",
                      }}
                    >
                      No se registran órdenes en el sistema.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className={activeId === order.id ? "row-selected" : ""}
                      onClick={() =>
                        setActiveId(order.id === activeId ? null : order.id)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td>#{order.id}</td>
                      <td>
                        <strong>
                          {order.user
                            ? `${order.user.firstname || ""} ${order.user.lastname || ""}`.trim()
                            : "—"}
                        </strong>
                        <br />
                        <span style={{ fontSize: "0.75rem", color: "#718096" }}>
                          {order.user?.email || ""}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            color: "#2b6cb0",
                          }}
                        >
                          {order.status || "—"}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: "#2b6cb0" }}>
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
          <div
            className="propuesta-detail"
            style={{
              flex: "0 0 37%",
              animation: "fadeIn 0.2s ease-out",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="propuesta-detail-header">
              <h3>Resumen de Orden #{activeOrder.id}</h3>
              <button
                className="btn-close-detail"
                onClick={() => setActiveId(null)}
              >
                ✕
              </button>
            </div>

            <div
              className="propuesta-detail-body"
              style={{ flex: 1, overflowY: "auto" }}
            >
              <h4
                style={{
                  margin: "0 0 10px 0",
                  color: "#2d3748",
                  borderBottom: "1px solid #edf2f7",
                  paddingBottom: "6px",
                }}
              >
                Datos de la Orden
              </h4>
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
                  <code
                    style={{
                      background: "#e6fffa",
                      color: "#234e52",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    {activeOrder.discountCode} (-
                    {activeOrder.discountPercentage}%)
                  </code>
                </div>
              )}

              <h4
                style={{
                  margin: "24px 0 10px 0",
                  color: "#2d3748",
                  borderBottom: "1px solid #edf2f7",
                  paddingBottom: "6px",
                }}
              >
                Cajas Adquiridas
              </h4>

              {!activeOrder.orderDetails ||
              activeOrder.orderDetails.length === 0 ? (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#718096",
                    fontStyle: "italic",
                  }}
                >
                  Sin detalles de cajas.
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {activeOrder.orderDetails.map((detail, i) => {
                    const unitPrice = Number(detail.unitPrice || 0);
                    const qty = Number(detail.quantity || 1);
                    const subtotal = Number(detail.subtotal || unitPrice * qty);

                    return (
                      <div
                        key={i}
                        style={{
                          background: "#f7fafc",
                          padding: "12px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <span
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              color: "#2d3748",
                              display: "block",
                            }}
                          >
                            {detail.boxName ||
                              detail.box?.name ||
                              "Caja Especial"}
                          </span>
                          <span
                            style={{ fontSize: "0.8rem", color: "#718096" }}
                          >
                            {qty} u. × ARS ${unitPrice.toLocaleString("es-AR")}
                          </span>
                          {detail.discountAmount > 0 && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "#e53e3e",
                                display: "block",
                              }}
                            >
                              Descuento: -ARS $
                              {Number(detail.discountAmount).toLocaleString(
                                "es-AR",
                              )}
                            </span>
                          )}
                        </div>
                        <div style={{ textAlign: "right", marginLeft: "10px" }}>
                          <span
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "700",
                              color: "#4a5568",
                            }}
                          >
                            ARS ${subtotal.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: "auto",
                padding: "16px",
                borderTop: "2px solid #edf2f7",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#4a5568",
                }}
              >
                Monto Neto Facturado:
              </span>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "800",
                  color: "#2b6cb0",
                }}
              >
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
