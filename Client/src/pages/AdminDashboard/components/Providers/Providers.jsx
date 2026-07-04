import "./Providers.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProviderDetail from "../ProviderDetail/ProviderDetail";
import {
  fetchSolicitations,
  updateSolicitation,
} from "../../../../redux/providerSolicitationSlice";
import { useToast } from "../../../../Context/ToastContext";
import StatusBadge from "../../../../components/StatusBadge/StatusBadge";

const mapEstado = (solicitationStatus) => {
  if (solicitationStatus === "CONFIRMADA") return "active";
  if (solicitationStatus === "RECHAZADA") return "suspended";
  return "pending";
};

function Providers() {
  const dispatch = useDispatch();
  const { solicitations, loading, status } = useSelector(
    (state) => state.providerSolicitations,
  );
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSolicitations());
    }
  }, [dispatch, status]);

  const proveedores = solicitations.map((s) => ({
    ...s,
    estado: mapEstado(s.solicitationStatus),
  }));

  const filtered = proveedores.filter(
    (p) =>
      p.id?.toString().includes(search) ||
      p.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedProveedor =
    proveedores.find((p) => p.id === selectedId) || null;

  const handleSuspend = async (id) => {
    try {
      await dispatch(
        updateSolicitation({
          id,
          payload: { solicitationStatus: "RECHAZADA", status: "REJECTED" },
        }),
      ).unwrap();
      toast.success(`Solicitud #${id} rechazada correctamente.`);
    } catch (err) {
      toast.error(
        `Error al rechazar: ${typeof err === "string" ? err : err?.message || "Error desconocido"}`,
      );
    }
  };

  const handleApprove = async (id) => {
    try {
      await dispatch(
        updateSolicitation({
          id,
          payload: { solicitationStatus: "CONFIRMADA", status: "APPROVED" },
        }),
      ).unwrap();
      toast.success(`Solicitud #${id} aprobada con éxito!`);
    } catch (err) {
      toast.error(
        `Error al aprobar: ${typeof err === "string" ? err : err?.message || "Error desconocido"}`,
      );
    }
  };

  if (loading && !solicitations.length) {
    return (
      <div style={{ padding: "2rem" }}>
        Cargando solicitudes desde la base de datos...
      </div>
    );
  }

  if (selectedProveedor) {
    return (
      <ProviderDetail
        proveedor={selectedProveedor}
        onBack={() => setSelectedId(null)}
        onSuspend={handleSuspend}
        onApprove={handleApprove}
      />
    );
  }

  return (
    <div className="proveedores">
      <div className="admin-tab-header">
        <h1>Solicitudes de Proveedores</h1>
        <p>
          Listado transaccional y gestión de postulaciones desde la base de
          datos MySQL.
        </p>
      </div>

      <div className="prov-toolbar">
        <input
          type="text"
          placeholder="Buscar por ID, empresa o localidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="prov-search"
        />
        <div className="prov-summary">
          <span>
            {proveedores.filter((p) => p.estado === "active").length} aprobados
          </span>
          <span>
            {proveedores.filter((p) => p.estado === "pending").length}{" "}
            pendientes
          </span>
          <span>
            {proveedores.filter((p) => p.estado === "suspended").length}{" "}
            rechazados
          </span>
        </div>
      </div>

      <div className="prov-table-wrapper">
        <table className="prov-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Empresa</th>
              <th>Categoría</th>
              <th>Localidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td>
                  <div>
                    <strong>{p.businessName || "—"}</strong>
                  </div>
                  {p.ownerName && (
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      {p.ownerName}
                    </div>
                  )}
                </td>
                <td>{p.category || "—"}</td>
                <td>{p.location || "—"}</td>
                <td>
                  <StatusBadge status={p.estado} />
                </td>
                <td>
                  <button
                    className="btn-prov-detail"
                    onClick={() => setSelectedId(p.id)}
                  >
                    Evaluar Propuesta
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Providers;
