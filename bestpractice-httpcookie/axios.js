/**
 * Axios instance untuk HttpOnly Cookie authentication
 *
 * Key differences dari localStorage version:
 * 1. withCredentials: true - Send cookies automatically
 * 2. NO manual Authorization header
 * 3. CSRF token management
 */

import axios from "axios";
import { getCSRFToken, clearCSRFToken } from "./csrf";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,

  // ✅ CRITICAL: Enable sending cookies cross-origin
  withCredentials: true,
});

// Request interceptor - Add CSRF token
apiClient.interceptors.request.use(
  (config) => {
    // Add CSRF token untuk non-GET requests
    if (config.method !== "get") {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
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
      console.error("Network Error:", error.message);
      return Promise.reject(error);
    }

    const status = error.response?.status;

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
      const message = error.response?.data?.message;
      if (message?.toLowerCase().includes("csrf")) {
        console.error("CSRF token validation failed");
        // Refresh CSRF token
        clearCSRFToken();
      } else {
        console.error("Forbidden:", message);
      }
    } else if (status === 404) {
      console.error("Endpoint not found:", error.config?.url);
    } else if (status >= 500) {
      console.error("Server error:", error.response?.data?.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
