import { useAuth } from "../context/AuthContext"
import PageContainer from "../components/layout/PageContainer"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Clipboard, LogOut, Package, Heart } from "lucide-react"

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const initials = user.username
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()

  function copyEmail() {
    navigator.clipboard.writeText(user.email)
    toast.success("Email copied")
  }

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* TOP PROFILE CARD */}
        <div className="
          relative
          border border-zinc-800
          rounded-2xl
          p-6 mb-8
          bg-gradient-to-br from-[#0f0f0f] to-[#090909]
        ">

          <div className="flex items-center gap-5">

            {/* AVATAR */}
            <div className="
              w-16 h-16 rounded-full
              bg-green-500/10
              flex items-center justify-center
              text-green-400 text-xl font-bold
              border border-green-500/20
            ">
              {initials}
            </div>

            {/* USER INFO */}
            <div>
              <h1 className="text-2xl font-semibold text-white">
                {user.username}
              </h1>

              <p className="text-sm text-gray-400">
                {user.email}
              </p>
            </div>

          </div>

          {/* QUICK ACTION */}
          <button
            onClick={copyEmail}
            className="
              absolute top-6 right-6
              flex items-center gap-2
              text-xs text-gray-400
              hover:text-green-400
              transition
            "
          >
            <Clipboard size={14} /> Copy Email
          </button>

        </div>

        {/* GRID LAYOUT */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT - DETAILS */}
          <div className="lg:col-span-2 border border-zinc-800 rounded-xl p-6">

            <h2 className="text-white font-semibold mb-5">
              Account Details
            </h2>

            <div className="space-y-4">

              <Detail label="Role" value={user.role} capitalize />

              <Detail
                label="Status"
                value={user.isBlocked ? "Blocked" : "Active"}
                badge
                danger={user.isBlocked}
              />

              <Detail
                label="Joined"
                value={new Date(user.createdAt).toLocaleDateString()}
              />

            </div>

          </div>

          {/* RIGHT - QUICK ACTIONS */}
          <div className="space-y-4">

            {/* ORDERS */}
            <button
              onClick={() => navigate("/orders")}
              className="
                w-full flex items-center justify-between
                border border-zinc-800
                rounded-xl p-5
                hover:border-green-500/40
                transition
              "
            >
              <span className="text-white text-sm">
                View Orders
              </span>
              <Package size={18} className="text-green-400" />
            </button>

            {/* WISHLIST */}
            <button
              onClick={() => navigate("/wishlist")}
              className="
                w-full flex items-center justify-between
                border border-zinc-800
                rounded-xl p-5
                hover:border-green-500/40
                transition
              "
            >
              <span className="text-white text-sm">
                Wishlist
              </span>
              <Heart size={18} className="text-pink-400" />
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center justify-between
                border border-red-500/30
                rounded-xl p-5
                text-red-400
                hover:bg-red-500/10
                transition
              "
            >
              <span className="text-sm">
                Logout
              </span>
              <LogOut size={18} />
            </button>

          </div>

        </div>

      </div>
    </PageContainer>
  )
}

/* ================= DETAIL ================= */

function Detail({ label, value, badge, danger, capitalize }) {
  return (
    <div className="flex justify-between items-center border-b border-zinc-800 pb-3">

      <span className="text-sm text-gray-400">
        {label}
      </span>

      {badge ? (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
            ${
              danger
                ? "bg-red-500/10 text-red-400"
                : "bg-green-500/10 text-green-400"
            }
          `}
        >
          {value}
        </span>
      ) : (
        <span
          className={`text-sm text-white ${
            capitalize ? "capitalize" : ""
          }`}
        >
          {value}
        </span>
      )}

    </div>
  )
}