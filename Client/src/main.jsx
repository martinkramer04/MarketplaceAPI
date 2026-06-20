import { createRoot } from "react-dom/client";
import CartProvider from "./Context/CartProvider.jsx";
import { ToastProvider } from "./Context/ToastContext.jsx";
import ToastContainer from "./components/Toast/Toast.jsx";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastProvider>
      <CartProvider>
        <App />
      </CartProvider>
      <ToastContainer />
    </ToastProvider>
  </Provider>,
);
