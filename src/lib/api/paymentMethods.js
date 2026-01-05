import apiClient from "@/lib/axios";

/**
 * Payment Methods API Service
 * Handles payment method CRUD operations
 */

export const paymentMethodsApi = {
  /**
   * Get all payment methods for user
   * GET /api/payments/methods
   */
  getAllPaymentMethods: async () => {
    const response = await apiClient.get("/api/payments/methods");
    return response.data;
  },

  /**
   * Get payment method by ID
   * GET /api/payments/methods/:id
   */
  getPaymentMethodById: async (id) => {
    const response = await apiClient.get(`/api/payments/methods/${id}`);
    return response.data;
  },

  /**
   * Get default payment method
   * GET /api/payments/methods/default
   */
  getDefaultPaymentMethod: async () => {
    const response = await apiClient.get("/api/payments/methods/default");
    return response.data;
  },

  /**
   * Create new payment method
   * POST /api/payments/methods
   */
  createPaymentMethod: async (data) => {
    const response = await apiClient.post("/api/payments/methods", data);
    return response.data;
  },

  /**
   * Update payment method (set as default, etc)
   * PUT /api/payments/methods/:id
   */
  updatePaymentMethod: async (id, data) => {
    const response = await apiClient.put(`/api/payments/methods/${id}`, data);
    return response.data;
  },

  /**
   * Delete payment method
   * DELETE /api/payments/methods/:id
   */
  deletePaymentMethod: async (id) => {
    const response = await apiClient.delete(`/api/payments/methods/${id}`);
    return response.data;
  },
};
