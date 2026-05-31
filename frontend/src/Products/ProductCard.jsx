import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { useAuth } from "../context/AuthContext"

import {
  Heart,
  ShoppingCart,
  Check,
  Loader2,
} from "lucide-react"

export default function ProductCard({ product }) {

  const { cart, addToCart } = useCart()

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist()

  const { isAuthenticated } = useAuth()

  const navigate = useNavigate()

  const location = useLocation()

  const [adding, setAdding] =
    useState(false)

  // FIXED HERE

  const isInCart = cart.some(
    item =>
      item.product_id === product.id
  )

  const isInWishlist =
    wishlist.some(
      item => item.id === product.id
    )

  /* ================= LOGIN REQUIRED ================= */

  const requireLogin = (
    message
  ) => {

    navigate("/login", {

      state: {

        from:
          location.pathname +
          location.search,

        message,

      },

    })

  }

  /* ================= PRODUCT PAGE ================= */

  const goToProduct = () => {

    navigate(
      `/product/${product.id}`
    )

  }

  /* ================= WISHLIST ================= */

  const toggleWishlist =
    async (e) => {

      e.stopPropagation()

      if (!isAuthenticated) {

        requireLogin(
          "Please login to manage wishlist"
        )

        return
      }

      isInWishlist
        ? await removeFromWishlist(
            product.id
          )
        : await addToWishlist(
            product
          )

    }

  /* ================= ADD TO CART ================= */

  const handleAddToCart =
    async (e) => {

      e.stopPropagation()

      if (!isAuthenticated) {

        requireLogin(
          "Please login to add items to cart"
        )

        return
      }

      // prevent spam clicks

      if (
        isInCart ||
        adding
      ) return

      try {

        setAdding(true)

        await addToCart(product)

      } catch (err) {

        console.error(err)

      } finally {

        setAdding(false)

      }

    }

  return (

    <div
      onClick={goToProduct}
      className="
        group
        cursor-pointer
        h-full
      "
    >

      <div
        className="
          relative
          h-full
          flex
          flex-col

          bg-[#0f0f0f]

          border
          border-zinc-800/80

          rounded-2xl
          overflow-hidden

          transition-all
          duration-300

          hover:border-green-500/30
          hover:-translate-y-1.5

          hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8),0_0_0_1px_rgba(74,222,128,0.05)]
        "
      >

        {/* IMAGE AREA */}

        <div
          className="
            relative
            h-56

            bg-gradient-to-b
            from-zinc-900
            to-[#0a0a0a]

            overflow-hidden
          "
        >

          {/* subtle grid */}

          <div
            className="
              absolute inset-0

              opacity-[0.03]

              [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]

              [background-size:24px_24px]
            "
          />

          {/* hover glow */}

          <div
            className="
              absolute inset-0

              opacity-0
              group-hover:opacity-100

              transition-opacity
              duration-500

              bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.08)_0%,transparent_70%)]
            "
          />

          {/* image */}

          <img
            src={product.image}
            alt={product.name}
            className="
              relative z-10

              w-full h-full
              object-contain

              p-6

              transition-transform
              duration-500

              group-hover:scale-105
            "
          />

          {/* CATEGORY */}

          <div
            className="
              absolute top-3 left-3 z-20

              px-2 py-0.5

              bg-black/70
              backdrop-blur-sm

              border border-zinc-700/60

              rounded-md

              text-[10px]
              text-zinc-400

              font-medium
              uppercase
              tracking-wider
            "
          >

            {product.category}

          </div>

          {/* WISHLIST */}

          <button
            onClick={toggleWishlist}
            className={`
              absolute top-3 right-3 z-20

              w-8 h-8
              rounded-full

              flex
              items-center
              justify-center

              border

              transition-all
              duration-200

              ${
                isInWishlist

                  ? "bg-pink-500/15 border-pink-500/40"

                  : "bg-black/60 border-zinc-700/60 hover:border-zinc-500"
              }
            `}
          >

            <Heart
              size={13}
              className={
                isInWishlist

                  ? "text-pink-400 fill-pink-400"

                  : "text-zinc-300"
              }
            />

          </button>

        </div>

        {/* CONTENT */}

        <div
          className="
            flex
            flex-col
            flex-1

            p-4
            pt-3.5
          "
        >

          <h3
            className="
              text-white
              text-sm
              font-semibold

              leading-snug

              line-clamp-2

              group-hover:text-green-50

              transition-colors
              duration-200
            "
          >

            {product.name}

          </h3>

          {/* PRICE + BUTTON */}

          <div
            className="
              flex
              items-center
              justify-between

              mt-auto
              pt-4
            "
          >

            {/* PRICE */}

            <div className="flex flex-col">

              <span
                className="
                  text-green-400

                  font-bold
                  text-lg

                  leading-none
                "
              >
                ₹{product.price}
              </span>

            </div>

            {/* BUTTON */}

            <button
              onClick={handleAddToCart}

              disabled={
                isInCart ||
                adding
              }

              className={`
                flex
                items-center
                gap-1.5

                px-3.5 py-2

                rounded-lg

                text-xs
                font-semibold
                tracking-wide

                transition-all
                duration-200

                ${
                  isInCart

                    ? "bg-green-500/10 text-green-400 border border-green-500/25 cursor-default"

                    : adding

                    ? "bg-zinc-800 text-zinc-300 border border-zinc-700 cursor-not-allowed"

                    : "bg-green-500 text-black hover:bg-green-400 active:scale-95 shadow-[0_0_16px_rgba(74,222,128,0.25)] hover:shadow-[0_0_24px_rgba(74,222,128,0.4)]"
                }
              `}
            >

              {adding ? (

                <>
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />
                  Adding...
                </>

              ) : isInCart ? (

                <>
                  <Check size={12} />
                  Added
                </>

              ) : (

                <>
                  <ShoppingCart size={12} />
                  Add
                </>

              )}

            </button>

          </div>

        </div>

        {/* bottom accent */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0

            h-[2px]

            bg-gradient-to-r
            from-transparent
            via-green-500/50
            to-transparent

            scale-x-0
            group-hover:scale-x-100

            transition-transform
            duration-300
          "
        />

      </div>

    </div>

  )

}