import axios from "axios";
import { getCSRFToken, clearCSRFToken } from "./csrf";

const apiClient = axios.create({
  baseURL: "https://taskhub-be.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,

  withCredentials: true,
});

// Request interceptor - Add CSRF token
apiClient.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken();

    // Add CSRF token ke semua requests (protected endpoints require it)
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Save CSRF token jika backend send di response header
    const csrfToken = response.headers["x-csrf-token"];
    if (csrfToken && typeof window !== "undefined") {
      sessionStorage.setItem("csrf_token", csrfToken);
    }

    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      // Network error (e.g., no internet connection)
      console.error("Network error:", error.message);
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      // Unauthorized - cookie expired or invalid
      if (typeof window !== "undefined") {
        clearCSRFToken();

        // Redirect to login if not already there
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    } else if (status === 403) {
      // CSRF token invalid atau missing
      if (message?.toLowerCase().includes("csrf")) {
        clearCSRFToken();
      }
    } else if (status === 404) {
      console.error("Resource not found:", error.config.url);
    } else if (status >= 500) {
      console.error("Server error:", status, message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
