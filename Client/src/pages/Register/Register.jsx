import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';


function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-header">
          <div className="login-logo">
            BigBox<span>.</span>
          </div>
          <h1>Crear Cuenta</h1>
          <p>Unite a la red de regalos de experiencias más grande de la región.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          
          <div className="login-campo">
            <label htmlFor="name">Nombre Completo</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required 
            />
          </div>

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
            <label htmlFor="password">Contraseña</label>
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

          <div className="login-campo">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input 
              type="password" 
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="btn-login-submit">
            Registrarse →
          </button>

        </form>

        <div className="login-footer">
          <p>¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link></p>
        </div>

      </div>
    </div>
  );
}

export default Register;