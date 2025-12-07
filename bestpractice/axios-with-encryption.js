/**
 * Axios instance dengan token encryption
 * Ini adalah contoh implementasi dengan enkripsi token
 */

import axios from "axios";
import { decryptToken, getToken, isTokenExpired, clearAuthData } from "./security-utils";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: false,
});

// Request interceptor - Add encrypted token
apiClient.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      // Get token (automatically decrypted)
      const token = getToken();

      if (token) {
        // Check if token is expired
        if (isTokenExpired(token)) {
          console.warn("Token expired, clearing auth data");
          clearAuthData();
          window.location.href = "/login";
          return Promise.reject(new Error("Token expired"));
        }

        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 401) {
      // Unauthorized

      // Prevent infinite loop
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // Try to refresh token (if you have refresh token logic)
        // const refreshSuccess = await refreshAccessToken();
        // if (refreshSuccess) {
        //   return apiClient(originalRequest);
        // }
      }

      // Clear auth and redirect
      if (typeof window !== "undefined") {
        clearAuthData();

        // Only redirect if not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    } else if (status === 403) {
      // Forbidden - user doesn't have permission
      console.error("Forbidden:", error.response?.data?.message);
    } else if (status === 404) {
      // Not found
      console.error("Endpoint not found:", error.config?.url);
    } else if (status >= 500) {
      // Server error
      console.error("Server error:", error.response?.data?.message);
    }

    return Promise.reject(error);
  },
);

/**
 * Optional: Refresh token function
 * Uncomment dan adjust jika backend support refresh token
 */
/*
async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return false;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      { refreshToken }
    );

    const { token } = response.data;
    storeToken(token);
    return true;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
}
*/

export default apiClient;
