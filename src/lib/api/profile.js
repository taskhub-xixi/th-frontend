import apiClient from "@/lib/axios";

/**
 * Profile API Service
 * Handles user profile operations
 */

export const profileApi = {
  /**
   * Get user profile
   * GET /api/user/profile
   */
  getProfile: async () => {
    const response = await apiClient.get("/api/user/profile");
    return response.data;
  },

  /**
   * Update user profile
   * PUT /api/user/profile
   */
  updateProfile: async (data) => {
    const response = await apiClient.put("/api/user/profile", data);
    return response.data;
  },

  /**
   * Update user avatar
   * POST /api/user/profile/avatar
   */
  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    // IMPORTANT: Don't set Content-Type header for FormData
    // Set it to undefined to let browser automatically set multipart/form-data with boundary
    const response = await apiClient.post(
      "/api/user/profile/avatar",
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      }
    );
    return response.data;
  },

  /**
   * Update user role
   * PUT /api/user/role
   */
  updateRole: async (role) => {
    const response = await apiClient.put("/api/user/role", { role });
    return response.data;
  },

  /**
   * Get user notification settings
   * GET /api/user/settings
   */
  getSettings: async () => {
    const response = await apiClient.get("/api/user/settings", {
      timeout: 15000, // Increase timeout to 15 seconds for settings
    });
    return response.data;
  },

  /**
   * Update user notification settings
   * PUT /api/user/settings
   */
  updateSettings: async (data) => {
    const response = await apiClient.put("/api/user/settings", data, {
      timeout: 15000, // Increase timeout to 15 seconds for settings
    });
    return response.data;
  },

  /**
   * Update user appearance settings
   * PUT /api/user/appearance
   */
  updateAppearance: async (data) => {
    const response = await apiClient.put("/api/user/appearance", data);
    return response.data;
  },

  /**
   * Delete user account
   * DELETE /api/user/account
   */
  deleteAccount: async (data) => {
    const response = await apiClient.delete("/api/user/account", {
      data, // Include any required data in the request body
    });
    return response.data;
  },
};
