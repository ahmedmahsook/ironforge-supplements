import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }
);

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    // =====================
    // ACCESS TOKEN EXPIRED
    // =====================

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(
        "/auth/refresh"
      )
    ) {

      originalRequest._retry = true;

      try {

        // =====================
        // REFRESH TOKEN REQUEST
        // =====================

        const res = await axios.post(
          "http://localhost:8080/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken =
          res.data.access_token;

        // =====================
        // SAVE NEW TOKEN
        // =====================

        localStorage.setItem(
          "token",
          newAccessToken
        );

        // =====================
        // UPDATE HEADER
        // =====================

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // =====================
        // RETRY ORIGINAL REQUEST
        // =====================

        return api(originalRequest);

      } catch (refreshError) {

        // =====================
        // CLEAR STORAGE
        // =====================

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        sessionStorage.clear();

        // =====================
        // REDIRECT TO LOGIN
        // =====================

        window.location.replace(
          "/login"
        );

        return Promise.reject(
          refreshError
        );

      }

    }

    return Promise.reject(error);

  }
);

export default api;