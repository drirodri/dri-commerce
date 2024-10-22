import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";
import { CartProvider } from "./context/CartContext/CartProvider";

function App() {
  return (
    <>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </>
  );
}

export default App;
