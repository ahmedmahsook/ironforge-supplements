import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import PageContainer from "../components/layout/PageContainer"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")

  const { register, authLoading, authError, setAuthError } = useAuth()
  const navigate = useNavigate()

  // Clear auth error when leaving page
  useEffect(() => {
    return () => setAuthError("")
  }, [setAuthError])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")
    setAuthError("")

    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()

 
    if (
      !trimmedUsername ||
      !trimmedEmail ||
      !password ||
      !confirmPassword
    ) {
      setLocalError("All fields are required")
      return
    }

   
    if (trimmedUsername.length < 3) {
      setLocalError("Username must be at least 3 characters")
      return
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setLocalError("Please enter a valid email address")
      return
    }

    
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters")
      return
    }

    
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match")
      return
    }

 
    const result = await register({
      username: trimmedUsername,
      email: trimmedEmail,
      password,
    })

    if (result.success) {
      navigate("/login")
    }
  }

  return (
    <PageContainer>
      <div className="flex justify-center py-24">
        <div className="w-full max-w-md bg-[#161616] border border-[#2a2a2a] rounded-2xl p-8 shadow-xl">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-sm text-[#8a8a8a]">
              Join IronForge to start your fitness journey
            </p>
          </div>

       
          {(localError || authError) && (
            <div className="mb-6 rounded-lg border border-red-700/40 bg-red-900/30 text-red-300 px-4 py-3 text-sm">
              {localError || authError}
            </div>
          )}

       
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm text-[#8a8a8a] mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-white placeholder-[#6a6a6a] focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-[#8a8a8a] mb-2">
                Email address
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-white placeholder-[#6a6a6a] focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-[#8a8a8a] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-white placeholder-[#6a6a6a] focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-[#8a8a8a] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-white placeholder-[#6a6a6a] focus:outline-none focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {authLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

     
          <p className="mt-8 text-center text-sm text-[#8a8a8a]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-400 hover:text-green-300 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
