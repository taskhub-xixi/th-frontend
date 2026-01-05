import apiClient from "@/lib/axios";

/**
 * Auth API Service
 * Handles authentication operations: register, login, logout, CSRF token
 */

export const authApi = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register: async (data) => {
    const response = await apiClient.post("/api/auth/register", data);
    return response.data;
  },

  /**
   * Login user
   * POST /api/auth/login
   */
  login: async (data) => {
    const response = await apiClient.post("/api/auth/login", data);
    return response.data;
  },

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout: async () => {
    const response = await apiClient.post("/api/auth/logout");
    return response.data;
  },

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  getMe: async () => {
    const response = await apiClient.get("/api/auth/me");
    return response.data;
  },

  /**
   * Get CSRF token
   * GET /api/auth/csrf-token
   */
  getCSRFToken: async () => {
    const response = await apiClient.get("/api/auth/csrf-token");
    return response.data;
  },

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (email) => {
    const response = await apiClient.post("/api/auth/forgot-password", { email });
    return response.data;
  },

  /**
   * Verify reset token
   * GET /api/auth/verify-reset-token/:token
   */
  verifyResetToken: async (token) => {
    const response = await apiClient.get(`/api/auth/verify-reset-token/${token}`);
    return response.data;
  },

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  resetPassword: async (token, password, confirmPassword) => {
    const response = await apiClient.post("/api/auth/reset-password", {
      token,
      password,
      confirmPassword,
    });
    return response.data;
  },
};
