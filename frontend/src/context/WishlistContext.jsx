import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import { useCart } from "./CartContext";

import api from "../api/api";

import toast from "react-hot-toast";

const WishlistContext =
  createContext();

export function WishlistProvider({
  children,
}) {
  const { user } = useAuth();

  const { addToCart } =
    useCart();

  const [wishlist, setWishlist] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  /* ================= FETCH WISHLIST ================= */

  useEffect(() => {
    const fetchWishlist =
      async () => {
        if (!user) {
          setWishlist([]);
          return;
        }

        try {
          setLoading(true);

          const res =
            await api.get(
              "/api/wishlist"
            );

          setWishlist(
            (
              res.data.items || []
            ).map((item) => ({
              ...item,

              id:
                item.product_id,
            }))
          );

        } catch (err) {
          console.error(
            "Failed to fetch wishlist:",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchWishlist();
  }, [user]);

  /* ================= ADD ================= */

  const addToWishlist =
    async (product) => {
      if (!user) return;

      try {
        const exists =
          wishlist.some(
            (item) =>
              item.id ===
              product.id
          );

        if (exists) {
          toast.error(
            "Already in wishlist"
          );
          return;
        }

        await api.post(
          "/api/wishlist",
          {
            product_id:
              product.id,
          }
        );

        setWishlist((prev) => [
          ...prev,
          {
            id: product.id,

            product_id:
              product.id,

            name:
              product.name,

            price:
              product.price,

            image:
              product.image,
          },
        ]);

        toast.success(
          "Added to wishlist"
        );

      } catch (err) {
        console.error(
          "Add wishlist failed:",
          err
        );

        toast.error(
          "Failed to add wishlist"
        );
      }
    };

  /* ================= REMOVE ================= */

  const removeFromWishlist =
    async (productId) => {
      try {
        await api.delete(
          `/api/wishlist/${productId}`
        );

        setWishlist((prev) =>
          prev.filter(
            (item) =>
              item.id !==
              productId
          )
        );

        toast.success(
          "Removed from wishlist"
        );

      } catch (err) {
        console.error(
          "Remove wishlist failed:",
          err
        );

        toast.error(
          "Failed to remove wishlist"
        );
      }
    };

  /* ================= MOVE TO CART ================= */

  const moveToCart =
    async (item) => {
      try {
        await addToCart({
          id: item.id,

          name:
            item.name,

          price:
            item.price,

          image:
            item.image,
        });

        await removeFromWishlist(
          item.id
        );

      } catch (err) {
        console.error(
          "Move to cart failed:",
          err
        );
      }
    };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,

        loading,

        addToWishlist,

        removeFromWishlist,

        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist =
  () => useContext(WishlistContext);