import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLoginSuccess) {
      // Simulamos pasarle al padre qué tipo de usuario entró
      onLoginSuccess({ email: form.email, role: 'provider' });
    } else {
      console.log('Datos de inicio de sesión:', form);
      alert('¡Ingreso simulado con éxito!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-header">
          <div className="login-logo">
            BigBox<span>.</span>
          </div>
          <h1>Ingreso de Proveedores</h1>
          <p>Gestioná tus experiencias, propuestas y métricas en un solo lugar.</p>
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
              placeholder="ejemplo@proveedor.com"
              required 
            />
          </div>

          <div className="login-campo">
            <div className="login-label-row">
              <label htmlFor="password">Contraseña</label>
              <a href="#recuperar" className="login-forgot">¿La olvidaste?</a>
            </div>
            <input 
              type="password" 
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required 
            />
          </div>

          <div className="login-options-row">
            <label className="login-checkbox-label">
              <input 
                type="checkbox" 
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
              />
              <span>Recordarme en este equipo</span>
            </label>
          </div>

          <button type="submit" className="btn-login-submit">
            Iniciar Sesión →
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;