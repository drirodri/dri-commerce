import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HomeV2 from "./pages/HomeV2";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";
import { CartProvider } from "./context/CartContext/CartProvider";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomeV2 />} />
              <Route path="/home-old" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/product/:id/:quantity" element={<Product />} />
              <Route path="/cartcheckout" element={<CheckoutPage />} />
              <Route path="/*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
