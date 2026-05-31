import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/api";

import toast from "react-hot-toast";

export const AuthContext =
  createContext();

export function AuthProvider({
  children,
}) {

  const [user, setUser] =
    useState(null);

  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState(false);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(false);

  const [authError, setAuthError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  /* ================= INIT ================= */

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    const token =
      localStorage.getItem("token");

    if (storedUser && token) {

      setUser(
        JSON.parse(storedUser)
      );

      setIsAuthenticated(true);
    }

    setLoading(false);

  }, []);

  /* ================= REGISTER ================= */

  const register = async ({
    name,
    email,
    password,
  }) => {

    setAuthLoading(true);

    setAuthError("");

    try {

      await api.post(
        "/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      toast.success(
        "OTP sent to your email"
      );

      return {
        success: true,
      };

    } catch (err) {

      const message =
        err.response?.data?.error
          ?.message ||
        err.message ||
        "Registration failed";

      setAuthError(message);

      toast.error(message);

      return {
        success: false,
      };

    } finally {

      setAuthLoading(false);
    }
  };

  /* ================= LOGIN ================= */

  const login = async (
    email,
    password
  ) => {

    setAuthLoading(true);

    setAuthError("");

    try {

      const res = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      // Expected backend response:
      // {
      //   access_token: "...",
      //   user: {...}
      // }

      const token =
        res.data.access_token;

      const userData =
        res.data.user;

      if (!token || !userData) {

        throw new Error(
          "Invalid login response"
        );
      }

      /* SAVE ACCESS TOKEN */

      localStorage.setItem(
        "token",
        token
      );

      /* SAVE USER */

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      setUser(userData);

      setIsAuthenticated(true);

      toast.success(
        `Welcome back, ${userData.name}`
      );

      return {
        success: true,
      };

    } catch (err) {

      const message =
        err.response?.data?.error
          ?.message ||
        err.message ||
        "Login failed";

      setAuthError(message);

      toast.error(message);

      return {
        success: false,
      };

    } finally {

      setAuthLoading(false);
    }
  };

  /* ================= LOGOUT ================= */

  const logout = async () => {

    try {

      await api.post(
        "/auth/logout"
      );

    } catch (err) {

      console.error(err);
    }

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );

    setUser(null);

    setIsAuthenticated(false);

    toast.success(
      "Logged out successfully"
    );
  };

  /* ================= UPDATE USER ================= */

  const updateUser = (
    updatedUser
  ) => {

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

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
  );
}

export const useAuth = () =>
  useContext(AuthContext);