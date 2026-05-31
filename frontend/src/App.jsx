import { Routes, Route } from "react-router-dom";

import UserLayout from "./layouts/UserLayout";

import ProtectedRoute from "./routes/ProtectedRoute";

import { AdminRoutes } from "./routes/AdminRoutes";

/* ================= USER PAGES ================= */

import Home from "./pages/Home";

import Login from "./pages/Login";

import Register from "./pages/Register";

import VerifyOTP from "./pages/VerifyOTP";

import Products from "./pages/Products";

import ProductDetails from "./pages/ProductDetails";

import Cart from "./pages/Cart";

import Checkout from "./pages/Checkout";

import Orders from "./pages/Orders";

import OrderSuccess from "./pages/OrderSuccess";

import Wishlist from "./pages/Wishlist";

import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      {/* ================= USER ROUTES ================= */}

      <Route element={<UserLayout />}>
        {/* PUBLIC */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        {/* PROTECTED */}

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ================= ADMIN ROUTES ================= */}

      {AdminRoutes}
    </Routes>
  );
}

export default App;