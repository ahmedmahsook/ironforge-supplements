import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"

export default function ProductActions({ product, from }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { cart, addToCart } = useCart()
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()

  const isInCart = cart.some(item => item.id === product.id)
  const isInWishlist = wishlist.some(item => item.id === product.id)

  const requireLogin = (message) => {
    navigate("/login", {
      state: { from, message },
    })
  }

  const handleCart = async () => {
    if (!isAuthenticated) {
      requireLogin("Please login to add items to cart")
      return
    }
    if (!isInCart) await addToCart(product)
  }

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      requireLogin("Please login to manage wishlist")
      return
    }

    if (isInWishlist) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  return (
    <div className="flex items-center gap-4 mt-10">

      {/* PRIMARY BUTTON */}
      <button
        onClick={handleCart}
        disabled={isInCart}
        className={`
          flex-1
          h-12
          rounded-xl
          font-semibold
          text-sm
          transition-all duration-200
          ${
            isInCart
              ? "bg-zinc-800 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-black hover:bg-green-400 active:scale-[0.98]"
          }
        `}
      >
        {isInCart ? "Added to Cart ✓" : "Add to Cart"}
      </button>

      {/* SECONDARY BUTTON */}
      <button
        onClick={handleWishlist}
        className={`
          h-12
          px-5
          rounded-xl
          border
          text-sm font-medium
          transition-all duration-200
          ${
            isInWishlist
              ? "border-pink-500 text-pink-500 bg-pink-500/10"
              : "border-zinc-700 text-gray-400 hover:border-pink-400 hover:text-pink-400"
          }
        `}
      >
        {isInWishlist ? "♥ Wishlisted" : "♡ Wishlist"}
      </button>

    </div>
  )
}