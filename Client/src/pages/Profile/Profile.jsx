import "./Profile.css";
import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { useToast } from "../../Context/ToastContext";

function Profile() {
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", password: "", repeatPassword: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
        setForm({
          firstname: res.data.firstname || "",
          lastname: res.data.lastname || "",
          email: res.data.email || "",
          password: "",
          repeatPassword: ""
        });

        // 🟢 CORRECCIÓN: Si es ADMIN o es PROVIDER, ninguno de los dos busca órdenes de compra.
        if (res.data.role === "ADMIN" || res.data.role === "PROVIDER") {
          setOrders([]); // Setamos la lista vacía de forma segura
          setLoading(false);
          return null; // Cortamos la ejecución acá para que no falle 🚀
        }

        // Solo los clientes comunes (USER) avanzan a buscar sus órdenes
        return api.get(`/api/orders/user/${res.data.id}`);
      })
      .then((res) => {
        if (res) {
          setOrders(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error al cargar perfil:", err);
        setError("No se pudieron cargar los datos del perfil.");
        setLoading(false);
      });
  }, []);
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.repeatPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    setSaving(true);
    const payload = { firstname: form.firstname, lastname: form.lastname, email: form.email };
    if (form.password) payload.password = form.password;
    try {
      await api.put("/auth/me", payload);
      toast.success("Cambios guardados correctamente.");
      setForm((prev) => ({ ...prev, password: "", repeatPassword: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase();
  };

  if (loading) return <p className="loading-msg">Cargando perfil...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!user) return null;

  return (
    <div className="perfil">
      <div className="perfil-header">
        <div className="perfil-avatar">
          {getInitials(user.firstname, user.lastname)}
        </div>
        <div className="perfil-info">
          <h1>
            {user.firstname} {user.lastname}
          </h1>
          <p>{user.email}</p>
          <span className="perfil-since">
            {user.role === "ADMIN" && "👑 Administrador"}
            {user.role === "PROVIDER" && "🏢 Proveedor"}
            {user.role === "USER" && "👤 Usuario"}
          </span>
        </div>
      </div>

      {/* Cambiamos la grilla del body si es Admin para que visualmente quede centrado y prolijo */}
      <div className={`perfil-body ${user.role === "ADMIN" ? "perfil-body-admin" : ""}`}>

        {/* 🟢 OCULTADO CONDICIONAL: "Mis pedidos" SOLO si NO es Administrador */}
        {user.role !== "ADMIN" && (
          <section className="perfil-orders">
            <h2>Mis pedidos</h2>

            {orders.length === 0 ? (
              <p className="perfil-no-orders">
                Todavía no tenés pedidos realizados.
              </p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="perfil-order-item">
                  <div className="order-info">
                    <span className="order-id">#{order.id}</span>
                    <h3>{order.orderDetails?.[0]?.boxName || "Pedido"}</h3>
                    {order.orderDetails?.length > 1 && (
                      <span className="order-extra">
                        +{order.orderDetails.length - 1} producto(s) más
                      </span>
                    )}
                  </div>
                  <div className="order-right">
                    <span className={`order-status ${order.status === "ACTIVE" ? "status-active" : "status-used"}`}>
                      {order.status === "ACTIVE" ? "Activo" : "Canjeado"}
                    </span>
                    <span className="order-price">${order.totalAmount}.00</span>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {/* DATOS */}
        <section className="perfil-datos">
          <h2>Mis datos</h2>
          <form onSubmit={handleSubmit}>
            <div className="perfil-campo">
              <label>Nombre</label>
              <input type="text" name="firstname" value={form.firstname} onChange={handleChange} required />
            </div>
            <div className="perfil-campo">
              <label>Apellido</label>
              <input type="text" name="lastname" value={form.lastname} onChange={handleChange} required />
            </div>
            <div className="perfil-campo">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="perfil-campo">
              <label>Nueva contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Dejar en blanco para no cambiar" />
            </div>
            <div className="perfil-campo">
              <label>Repetir contraseña</label>
              <input type="password" name="repeatPassword" value={form.repeatPassword} onChange={handleChange} placeholder="Repetir nueva contraseña" />
            </div>
            <div className="perfil-campo">
              <label>Rol actual</label>
              <input type="text" value={user.role} disabled />
            </div>
            <button className="btn-guardar" type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Profile;