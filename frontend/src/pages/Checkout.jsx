import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import api from "../api/api"
import PageContainer from "../components/layout/PageContainer"

export default function Checkout() {
  const navigate = useNavigate()
  const { cart = [], clearCart, totalPrice = 0 } = useCart()
  const { user, updateUser } = useAuth()

  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    pincode: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [transactionId, setTransactionId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!user) {
    navigate("/login", { state: { from: "/checkout" } })
    return null
  }

  if (cart.length === 0) {
    return (
      <PageContainer>
        <p className="text-center py-32 text-gray-400">
          Your cart is empty
        </p>
      </PageContainer>
    )
  }

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    if (!address.name || !address.street || !address.city || !address.pincode) {
      setError("Fill all fields")
      return
    }

    if (paymentMethod === "upi" && !transactionId.trim()) {
      setError("Enter UPI ID")
      return
    }

    setLoading(true)

    try {
      const { data: latestUser } = await api.get(`/users/${user.id}`)

      const newOrder = {
        id: "ORD-" + Date.now(),
        items: cart,
        address,
        paymentMethod,
        transactionId,
        total: totalPrice,
      }

      await api.patch(`/users/${user.id}`, {
        orders: [...(latestUser.orders || []), newOrder],
        cart: [],
      })

      updateUser({
        ...latestUser,
        orders: [...(latestUser.orders || []), newOrder],
        cart: [],
      })

      clearCart()
      navigate("/orders")
    } catch {
      setError("Order failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>

      <div className="max-w-6xl mx-auto py-14">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-white">
            Checkout
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Enter details and complete your purchase
          </p>
        </div>

        {error && <p className="text-red-400 mb-6">{error}</p>}

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-14">

          {/* LEFT SIDE */}
          <div className="space-y-12">

            {/* ADDRESS */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-5">
                Shipping Address
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: "name", label: "Full Name" },
                  { key: "street", label: "Street Address" },
                  { key: "city", label: "City" },
                  { key: "pincode", label: "Pincode" },
                ].map(({ key, label }) => (
                  <input
                    key={key}
                    name={key}
                    value={address[key]}
                    onChange={handleChange}
                    placeholder={label}
                    className="
                      px-4 py-3 rounded-lg
                      bg-[#111]
                      border border-zinc-800
                      text-white
                      focus:outline-none
                      focus:border-green-500
                    "
                  />
                ))}
              </div>
            </div>

            {/* PAYMENT */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-5">
                Payment Method
              </h2>

              <div className="grid gap-4">

                {/* COD */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`
                    p-4 rounded-xl cursor-pointer border transition
                    ${
                      paymentMethod === "cod"
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-800 hover:border-zinc-600"
                    }
                  `}
                >
                  <p className="text-white font-medium">
                    Cash on Delivery
                  </p>
                  <p className="text-gray-400 text-sm">
                    Pay when product arrives
                  </p>
                </div>

                {/* UPI */}
                <div
                  onClick={() => setPaymentMethod("upi")}
                  className={`
                    p-4 rounded-xl cursor-pointer border transition
                    ${
                      paymentMethod === "upi"
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-800 hover:border-zinc-600"
                    }
                  `}
                >
                  <p className="text-white font-medium">
                    UPI Payment
                  </p>
                  <p className="text-gray-400 text-sm">
                    Pay using Google Pay / PhonePe / Paytm
                  </p>

                  {paymentMethod === "upi" && (
                    <input
                      type="text"
                      placeholder="Enter Transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="
                        mt-3 w-full px-3 py-2 rounded-md
                        bg-[#0d0d0d]
                        border border-zinc-700
                        text-white text-sm
                        focus:outline-none
                        focus:border-green-500
                      "
                    />
                  )}
                </div>

                {/* CARD */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`
                    p-4 rounded-xl cursor-pointer border transition
                    ${
                      paymentMethod === "card"
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-800 hover:border-zinc-600"
                    }
                  `}
                >
                  <p className="text-white font-medium">
                    Credit / Debit Card
                  </p>
                  <p className="text-gray-400 text-sm">
                    Secure card payment
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="sticky top-24 h-fit">

            <div className="
              bg-[#0f0f0f]
              border border-zinc-800
              rounded-xl
              p-6
              space-y-6
            ">

              <h2 className="text-lg font-semibold text-white">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-400">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="text-white">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800"></div>

              <div className="flex justify-between items-center">
                <span className="text-white">Total</span>
                <span className="text-xl font-bold text-green-400">
                  ₹{totalPrice}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="
                  w-full h-12
                  bg-green-500 text-black
                  rounded-lg
                  font-semibold
                  hover:bg-green-400
                  active:scale-[0.98]
                  transition
                "
              >
                {loading ? "Processing..." : "Place Order"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </PageContainer>
  )
}