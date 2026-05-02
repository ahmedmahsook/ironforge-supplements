import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import PageContainer from "../components/layout/PageContainer"
import CartItem from "../Cart/CartItem"

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    loading,
  } = useCart()

  const navigate = useNavigate()

  if (!loading && cart.length === 0) {
    return (
      <PageContainer>
        <div className="py-40 text-center space-y-6">
          <h2 className="text-4xl font-semibold text-white tracking-tight">
            Your cart is empty
          </h2>

          <p className="text-gray-400 text-sm">
            Add products to your cart to continue
          </p>

          <Link
            to="/products"
            className="
              inline-block
              bg-green-500 text-black
              px-6 py-3 rounded-lg
              text-sm font-medium
              hover:bg-green-400
              transition
            "
          >
            Browse Products
          </Link>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>

      <div className="max-w-7xl mx-auto py-12">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {cart.length} item{cart.length > 1 && "s"} in your cart
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-14">

          {/* ITEMS */}
          <div className="space-y-8">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border-b border-zinc-800 pb-6"
              >
                <CartItem
                  item={item}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                />
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="sticky top-24 h-fit">

            <div className="
              bg-[#0f0f0f]
              border border-green-500/20
              rounded-xl
              p-7
              space-y-7
            ">

              {/* TITLE */}
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Order Summary
              </h2>

              {/* DETAILS */}
              <div className="space-y-4 text-sm">

                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Delivery</span>
                  <span className="text-white">Free</span>
                </div>

              </div>

              {/* DIVIDER */}
              <div className="border-t border-green-500/20"></div>

              {/* TOTAL */}
              <div className="flex justify-between items-end">

                <div>
                  <p className="text-sm text-gray-400">
                    Total
                  </p>
                  <p className="text-xs text-gray-500">
                    Inclusive of taxes
                  </p>
                </div>

                <p className="text-3xl font-bold text-green-400 tracking-tight">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </p>

              </div>

              {/* BUTTON */}
              <button
                onClick={() => navigate("/checkout")}
                disabled={loading}
                className="
                  w-full h-12
                  bg-green-500 text-black
                  rounded-lg
                  text-sm font-semibold
                  hover:bg-green-400
                  active:scale-[0.98]
                  transition
                  disabled:opacity-50
                "
              >
                Proceed to Checkout
              </button>

              {/* FOOTER ACTIONS */}
              <div className="flex justify-between text-sm">

                <button
                  onClick={clearCart}
                  className="text-gray-400 hover:text-red-400 transition"
                >
                  Clear Cart
                </button>

                <Link
                  to="/products"
                  className="text-gray-400 hover:text-white transition"
                >
                  Continue Shopping
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </PageContainer>
  )
}