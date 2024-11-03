import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";
import { CartProvider } from "./context/CartContext/CartProvider";
import Layout from "./pages/Layout";

function App() {
  return (
    <>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id/:quantity" element={<Product />} />
            <Route path="/cartcheckout" element={<CheckoutPage />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </CartProvider>
    </>
  );
}

export default App;
