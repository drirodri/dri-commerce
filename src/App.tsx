import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./context/CartContext/CartProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/ui/Loading";
import Layout from "./pages/Layout";

const Home = lazy(() => import("./pages/Home"));
const HomeV2 = lazy(() => import("./pages/HomeV2"));
const Product = lazy(() => import("./pages/Product"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CheckoutFormPage = lazy(() => import("./pages/CheckoutFormPage"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProductDashboard = lazy(() => import("./pages/ProductDashboard"));
const CategoryDashboard = lazy(() => import("./pages/CategoryDashboard"));

const queryClient = new QueryClient();

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomeV2 />} />
              <Route path="/home-old" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/product/:id/:quantity" element={<Product />} />
              <Route path="/cartcheckout" element={<CheckoutPage />} />
              <Route path="/checkout" element={<CheckoutFormPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute requiredRoles={["ADMIN", "SELLER"]}>
                    <ProductDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <CategoryDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
