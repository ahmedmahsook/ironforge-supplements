import { BrowserRouter } from "react-router-dom"
import ReactDOM from "react-dom/client"
import App from "./App"

import ScrollToTop from "./components/layout/ScrollToTop"

import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"

import { Toaster } from "react-hot-toast"

import 'react-loading-skeleton/dist/skeleton.css'

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* 🔥 FIXES SCROLL ISSUE */}
    <ScrollToTop />

    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e1e1e",
                color: "#e5e5e5",
                border: "1px solid #404040",
              },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)
