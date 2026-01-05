import apiClient from "@/lib/axios";

/**
 * Ratings & Reviews API Service
 * Handles rating and review operations
 */

export const ratingsApi = {
  /**
   * Create a review
   * POST /api/ratings/reviews
   */
  createReview: async (data) => {
    const response = await apiClient.post("/api/ratings/reviews", data);
    return response.data;
  },

  /**
   * Get review by ID
   * GET /api/ratings/reviews/:id
   */
  getReviewById: async (id) => {
    const response = await apiClient.get(`/api/ratings/reviews/${id}`);
    return response.data;
  },

  /**
   * Get reviews for a job
   * GET /api/ratings/jobs/:jobId/reviews
   */
  getJobReviews: async (jobId) => {
    const response = await apiClient.get(`/api/ratings/jobs/${jobId}/reviews`);
    return response.data;
  },

  /**
   * Get reviews for a user
   * GET /api/ratings/users/:userId/reviews
   */
  getUserReviews: async (userId) => {
    const response = await apiClient.get(
      `/api/ratings/users/${userId}/reviews`,
    );
    return response.data;
  },

  /**
   * Get user rating
   * GET /api/ratings/users/:userId/rating
   */
  getUserRating: async (userId) => {
    const response = await apiClient.get(`/api/ratings/users/${userId}/rating`);
    return response.data;
  },

  /**
   * Get my reviews
   * GET /api/ratings/my-reviews
   */
  getMyReviews: async () => {
    const response = await apiClient.get("/api/ratings/my-reviews");
    return response.data;
  },

  /**
   * Get rating notifications
   * GET /api/ratings/notifications
   */
  getNotifications: async () => {
    const response = await apiClient.get("/api/ratings/notifications");
    return response.data;
  },

  /**
   * Mark notification as read
   * PUT /api/ratings/notifications/:id/read
   */
  markNotificationRead: async (notificationId) => {
    const response = await apiClient.put(
      `/api/ratings/notifications/${notificationId}/read`,
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   * PUT /api/ratings/notifications/mark-all-read
   */
  markAllNotificationsRead: async () => {
    const response = await apiClient.put(
      "/api/ratings/notifications/mark-all-read",
    );
    return response.data;
  },

  /**
   * Delete notification
   * DELETE /api/ratings/notifications/:id
   */
  deleteNotification: async (notificationId) => {
    const response = await apiClient.delete(
      `/api/ratings/notifications/${notificationId}`,
    );
    return response.data;
  },
};
