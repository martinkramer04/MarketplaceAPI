import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import BoxDetail from "./pages/BoxDetail/BoxDetail";
import Cart from "./pages/Cart/Cart";
import Explore from "./pages/Explore/Explore";

import ScrollToTop from "./Context/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/box/:id" element={<BoxDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
