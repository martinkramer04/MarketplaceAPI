import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import BoxDetail from "./pages/BoxDetail/BoxDetail";
import Cart from "./pages/Cart/Cart";
import Explore from "./pages/Explore/Explore";
import HowItWorks from './pages/HowItWorks/HowItWorks'
import Us from './pages/Us/Us'
import Profile from './pages/Profile/Profile'

import OrderSummary from './pages/Checkout/OrderSummary/OrderSummary'
import Payment from './pages/Checkout/Payment/Payment'
import Confirmation from './pages/Checkout/Confirmation/Confirmation'
import BecomeProvider from './pages/Provider/BecomeProvider/BecomeProvider'
import ProviderDashboard from './pages/Provider/ProviderDashboard/ProviderDashboard'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import NavbarProvider from "./components/Navbar/NavbarProvider";
import Login from "./components/Login/Login"
import Register from "./pages/Register/Register";

import ScrollToTop from "./Context/ScrollToTop";
import { ToastProvider } from "./Context/ToastContext";
import ToastContainer from "./components/Toast/Toast";

function AppLayout() {
  const location = useLocation();

  const isProvider = location.pathname.startsWith('/provider');
  const isAdmin = location.pathname.startsWith('/admin');
  const isLoginPath = location.pathname === '/login';
  const isRegisterPath = location.pathname === '/register';

  const session = localStorage.getItem('access_token');

  if (!session && !isLoginPath && !isRegisterPath) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* 🟢 Menús condicionales basados firmemente en la URL */}
      {!isProvider && !isAdmin && !isLoginPath && !isRegisterPath && <Navbar />}
      {isProvider && <NavbarProvider isAdmin={false} />}
      {isAdmin && <NavbarProvider isAdmin={true} />}

      <ScrollToTop />

      <Routes>
        {/* Rutas Públicas / Compradores */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/box/:id" element={<BoxDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/como-funciona" element={<HowItWorks />} />
        <Route path="/nosotros" element={<Us />} />
        <Route path="/perfil" element={<Profile />} /> {/* Perfil para Clientes */}
        <Route path="/checkout/order-summary" element={<OrderSummary />} />
        <Route path="/checkout/payment" element={<Payment />} />
        <Route path="/checkout/confirmation" element={<Confirmation />} />
        <Route path="/become-provider" element={<BecomeProvider />} />

        {/* 🏢 Entorno Proveedor (URL empieza con /provider) */}
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/perfil" element={<Profile />} /> {/* 🟢 AGREGADO: Perfil del Proveedor */}

        {/* 👑 Entorno Administrador (URL empieza con /admin) */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/perfil" element={<Profile />} /> {/* 🟢 AGREGADO: Perfil del Administrador */}
      </Routes>

      {!isLoginPath && !isRegisterPath && <Footer />}
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppLayout />
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;