import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="product/:id" element={<Product />} />
        <Route />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
