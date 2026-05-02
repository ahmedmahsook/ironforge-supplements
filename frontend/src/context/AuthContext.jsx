import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/api"
import toast from "react-hot-toast"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [loading, setLoading] = useState(true)

  /* ================= INIT ================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  /* ================= REGISTER ================= */

  const register = async ({ username, email, password }) => {
    setAuthLoading(true)
    setAuthError("")

    try {
      const { data } = await api.get(`/users?email=${email}`)
      if (data.length > 0) {
        throw new Error("Email already registered")
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        role: "user",
        isBlocked: false,
        cart: [],
        wishlist: [],
        orders: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await api.post("/users", newUser)

      toast.success("Account created successfully")
      return { success: true }

    } catch (err) {
      const message = err.message || "Registration failed"
      setAuthError(message)
      toast.error(message)
      return { success: false }
    } finally {
      setAuthLoading(false)
    }
  }

  /* ================= LOGIN ================= */

  const login = async (email, password) => {
    setAuthLoading(true)
    setAuthError("")

    try {
      const { data } = await api.get(
        `/users?email=${email}&password=${password}`
      )

      if (data.length === 0) {
        throw new Error("Invalid email or password")
      }

      if (data[0].isBlocked) {
        throw new Error("Your account has been blocked")
      }

      setUser(data[0])
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(data[0]))

      toast.success(`Welcome back, ${data[0].username}`)
      return { success: true }

    } catch (err) {
      const message = err.message || "Login failed"
      setAuthError(message)
      toast.error(message)
      return { success: false }
    } finally {
      setAuthLoading(false)
    }
  }

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
    toast.success("Logged out successfully")
  }

  /* ================= UPDATE USER ================= */

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        authError,
        loading,

        login,
        register,
        logout,

        updateUser,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
