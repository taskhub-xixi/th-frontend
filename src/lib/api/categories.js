import apiClient from "@/lib/axios";

/**
 * Categories API Service
 * Handles category operations
 */

export const categoriesApi = {
  /**
   * Get all categories
   * GET /api/categories
   */
  getAllCategories: async () => {
    const response = await apiClient.get("/api/categories");
    return response.data;
  },

  /**
   * Get category by ID
   * GET /api/categories/:id
   */
  getCategoryById: async (id) => {
    const response = await apiClient.get(`/api/categories/${id}`);
    return response.data;
  },
};
