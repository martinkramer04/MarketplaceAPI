import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import api from "../../api/axiosConfig";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    api
      .post("/auth/authenticate", {
        email: form.email,
        password: form.password,
      })
      .then((res) => {
        const token = res.data.accessToken || res.data.access_token;
        if (!token) throw new Error("Token no recibido del servidor");
        localStorage.setItem("access_token", token.trim());
        localStorage.setItem("user_session", "active");
        return api.get("/auth/me");
      })
      .then((res) => {
        setLoading(false);
        const role = res.data.role
          ?.toString()
          .replace("ROLE_", "")
          .toUpperCase();
        if (role === "PROVIDER") navigate("/provider/dashboard");
        else if (role === "ADMIN") navigate("/admin/dashboard");
        else navigate("/");
      })
      .catch((err) => {
        console.error("Error en login:", err);
        setError("Email o contraseña incorrectos. Intentá de nuevo.");
        setLoading(false);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            BigBox<span>.</span>
          </div>
          <h1>Ingreso a la Plataforma</h1>
          <p>
            Gestioná tus experiencias, propuestas y métricas en un solo lugar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-campo">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="login-campo">
            <div className="login-label-row">
              <label htmlFor="password">Contraseña</label>
            </div>
            <div className="login-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="login-toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mensaje de error si las credenciales son incorrectas */}
          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn-login-submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tenés una cuenta? <Link to="/register">Registrate acá</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
