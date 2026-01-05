import apiClient from "@/lib/axios";

/**
 * Fetch current user profile
 * @returns {Promise} User profile data
 */
export const getProfile = async () => {
  const response = await apiClient.get("/api/user/profile");
  return response.data.profile; // Return only profile object
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} Updated profile data
 */
export const updateProfile = async (profileData) => {
  const response = await apiClient.put("/api/user/profile", profileData);
  return response.data.profile; // Return only profile object
};

/**
 * Upload user avatar/profile picture
 * @param {File} file - Image file to upload
 * @returns {Promise} Upload response with image URL
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiClient.post("/api/user/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise} Response message
 */
export const sendPasswordResetEmail = async (email) => {
  const response = await apiClient.post("/api/auth/forgot-password", {
    email,
  });
  return response.data;
};

/**
 * Update user role
 * @param {string} role - User role (Poster or Tasker)
 * @returns {Promise} Response with updated user data
 */
export const updateRole = async (role) => {
  const response = await apiClient.put("/api/user/role", { role });
  return response.data;
};
