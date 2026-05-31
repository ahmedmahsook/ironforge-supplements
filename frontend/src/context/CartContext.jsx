import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../api/api";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH CART ================= */

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }

      try {
        setLoading(true);

        const res = await api.get("/api/cart");

        setCart(res.data.items || []);

      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  /* ================= ADD TO CART ================= */

  const addToCart = async (product) => {
    if (!user) return;

    try {
      await api.post("/api/cart", {
        product_id: product.id,
        quantity: 1,
      });

      setCart((prev) => {
        const existing = prev.find(
          (item) =>
            item.product_id === product.id
        );

        if (existing) {
          return prev.map((item) =>
            item.product_id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          );
        }

        return [
          ...prev,
          {
            product_id: product.id,
            quantity: 1,

            name: product.name,
            price: product.price,
            image: product.image,
          },
        ];
      });

      toast.success("Added to cart");

    } catch (err) {
      console.error("Add to cart failed:", err);

      toast.error("Failed to add to cart");
    }
  };

  /* ================= REMOVE FROM CART ================= */

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/api/cart/${productId}`);

      setCart((prev) =>
        prev.filter(
          (item) =>
            item.product_id !== productId
        )
      );

      toast.success("Removed from cart");

    } catch (err) {
      console.error("Remove from cart failed:", err);

      toast.error("Failed to remove item");
    }
  };

  /* ================= UPDATE QUANTITY ================= */

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    if (quantity < 1) return;

    try {
      await api.put(`/api/cart/${productId}`, {
        quantity,
      });

      setCart((prev) =>
        prev.map((item) =>
          item.product_id === productId
            ? {
                ...item,
                quantity,
              }
            : item
        )
      );

    } catch (err) {
      console.error("Update quantity failed:", err);

      toast.error("Failed to update quantity");
    }
  };

  /* ================= CLEAR CART ================= */

  const clearCart = async () => {
    try {
      await api.delete("/api/cart");

      setCart([]);

      toast.success("Cart cleared");

    } catch (err) {
      console.error("Clear cart failed:", err);

      toast.error("Failed to clear cart");
    }
  };

  /* ================= DERIVED VALUES ================= */

  const cartCount = Array.isArray(cart)
    ? cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      )
    : 0;

  const totalPrice = Array.isArray(cart)
    ? cart.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      )
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);