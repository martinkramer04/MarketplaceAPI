import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
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

import ScrollToTop from "./Context/ScrollToTop";

function AppLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const isProvider = location.pathname.startsWith('/provider');
  const isAdmin = location.pathname.startsWith('/admin');
  const isLoginPath = location.pathname === '/login';

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      {!isProvider && !isAdmin && !isLoginPath && <Navbar />}
      {isProvider && <NavbarProvider isAdmin={false} />}
      {isAdmin && <NavbarProvider isAdmin={true} />}
      <ScrollToTop />
      <Routes>
        <Route 
          path="/" 
          element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />} 
        />
        <Route path="/box/:id" element={<BoxDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/como-funciona" element={<HowItWorks />} />
        <Route path="/nosotros" element={<Us />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/checkout/order-summary" element={<OrderSummary />} />
        <Route path="/checkout/payment" element={<Payment />} />
        <Route path="/checkout/confirmation" element={<Confirmation />} />
        <Route path="/become-provider" element={<BecomeProvider />} />
        
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
        />
        <Route 
          path="/provider/dashboard" 
          element={isLoggedIn ? <ProviderDashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/admin/dashboard" 
          element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" replace />} 
        />
      </Routes>
      {!isLoginPath && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
