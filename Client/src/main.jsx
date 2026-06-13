import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CartProvider from "./Context/CartProvider.jsx";
import { ToastProvider } from "./Context/ToastContext.jsx";
import ToastContainer from "./components/Toast/Toast.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <CartProvider>
        <App />
      </CartProvider>
      <ToastContainer />
    </ToastProvider>
  </StrictMode>,
);
