import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { login, authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("All fields are required")
      return
    }

    const result = await login(email, password)

    if (result.success) {
      const storedUser = JSON.parse(localStorage.getItem("user"))

      // 🔐 ROLE-BASED REDIRECT (IMPORTANT)
      if (storedUser?.role === "admin") {
        navigate("/admin", { replace: true })
      } else if (location.state?.from) {
        navigate(location.state.from, { replace: true })
      } else {
        navigate("/", { replace: true })
      }
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#161616] border border-[#2a2a2a] rounded-2xl p-8 shadow-lg">

        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-5 rounded-lg border border-red-700/40 
                          bg-red-900/30 text-red-300 
                          px-4 py-3 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-[#0d0d0d]
                         border border-[#2a2a2a] rounded-lg
                         text-white placeholder-gray-500
                         focus:outline-none focus:border-green-500
                         transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#0d0d0d]
                         border border-[#2a2a2a] rounded-lg
                         text-white placeholder-gray-500
                         focus:outline-none focus:border-green-500
                         transition"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-green-600 hover:bg-green-700
                       text-black font-bold py-3 rounded-lg
                       transition disabled:opacity-60
                       disabled:cursor-not-allowed"
          >
            {authLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          New user?{" "}
          <Link
            to="/register"
            className="text-green-400 hover:text-green-300 font-medium"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
