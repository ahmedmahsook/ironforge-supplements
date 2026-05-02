import { useEffect, useState } from "react"
import api from "../api/api"
import { useAuth } from "../context/AuthContext"
import PageContainer from "../components/layout/PageContainer"
import { ChevronDown, ChevronUp, XCircle } from "lucide-react"

export default function Orders() {
  const { user, updateUser } = useAuth()
  const [openOrderId, setOpenOrderId] = useState(null)

  // 🔄 Refresh user orders on page load
  useEffect(() => {
    if (!user?.id) return

    async function refreshUser() {
      try {
        const { data } = await api.get(`/users/${user.id}`)
        updateUser(data)
      } catch (err) {
        console.error("Failed to refresh user orders", err)
      }
    }

    refreshUser()
  }, [user?.id, updateUser])

  const orders = user?.orders || []

  // ❌ EMPTY STATE
  if (orders.length === 0) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold text-white">
            No orders yet
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Your completed orders will appear here.
          </p>
        </div>
      </PageContainer>
    )
  }

  // ❌ CANCEL ORDER (only pending)
  async function cancelOrder(orderId) {
    try {
      const updatedOrders = user.orders.map(order =>
        order.id === orderId
          ? { ...order, status: "cancelled" }
          : order
      )

      await api.patch(`/users/${user.id}`, {
        orders: updatedOrders,
      })

      updateUser({ ...user, orders: updatedOrders })
    } catch (err) {
      console.error("Failed to cancel order", err)
    }
  }

  return (
    <PageContainer>
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          My Orders
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Track your recent purchases
        </p>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-6">
        {[...orders].reverse().map((order) => {
          const isOpen = openOrderId === order.id

          return (
            <div
              key={order.id}
              className="
                bg-[#141414]
                border border-[#262626]
                rounded-xl
                p-6
              "
            >
              {/* TOP ROW */}
              <div className="flex flex-wrap justify-between gap-6 items-start">
                {/* ORDER ID */}
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-sm font-medium text-white">
                    {order.id}
                  </p>
                </div>

                {/* TOTAL */}
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold text-green-400">
                    ₹{order.total}
                  </p>
                </div>

                {/* STATUS + CANCEL */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <StatusBadge status={order.status} />

                  {/* FRIENDLY CANCEL BUTTON */}
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="
                          mt-2
                          inline-flex items-center gap-1.5
                          text-xs font-medium
                          text-red-400
                          border border-red-500/20
                          bg-red-500/5
                          px-3 py-1.5
                          rounded-full
                          hover:bg-red-500/10
                          hover:border-red-500/30
                          transition
                        "
                      >
                        <XCircle size={14} />
                        Cancel order
                      </button>

                      <p className="text-[11px] text-gray-500 mt-1">
                        Can be cancelled before shipping
                      </p>
                    </>
                  )}
                </div>

                {/* DROPDOWN TOGGLE */}
                <button
                  onClick={() =>
                    setOpenOrderId(isOpen ? null : order.id)
                  }
                  className="
                    flex items-center gap-1
                    text-sm
                    text-gray-300
                    hover:text-white
                    transition
                  "
                >
                  {isOpen ? "Hide items" : "View items"}
                  {isOpen ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </div>

              {/* ITEMS DROPDOWN */}
              {isOpen && (
                <div className="mt-6 border-t border-[#262626] pt-4 space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-200">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-400">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </PageContainer>
  )
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"

  if (status === "delivered") {
    return (
      <span className={`${base} bg-green-500/10 text-green-400`}>
        Delivered
      </span>
    )
  }

  if (status === "shipped") {
    return (
      <span className={`${base} bg-blue-500/10 text-blue-400`}>
        Shipped
      </span>
    )
  }

  if (status === "cancelled") {
    return (
      <span className={`${base} bg-red-500/10 text-red-400`}>
        Cancelled
      </span>
    )
  }

  return (
    <span className={`${base} bg-yellow-500/10 text-yellow-400`}>
      Pending
    </span>
  )
}
