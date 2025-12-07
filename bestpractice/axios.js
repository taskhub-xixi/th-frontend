import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: false,
});

// Request interceptor - Add token to headers
apiClient.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
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
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 401) {
      // Unauthorized - clear auth and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");

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

export default apiClient;
