import apiClient from "@/lib/axios";

/**
 * Payments API Service
 * Handles payment and wallet operations
 */

export const paymentsApi = {
  /**
   * Add funds to wallet
   * POST /api/payments/wallet/add-funds
   */
  addFunds: async (data) => {
    const response = await apiClient.post("/api/payments/wallet/add-funds", data);
    return response.data;
  },
  /**
   * Create payment (poster only)
   * POST /api/payments
   */
  createPayment: async (data) => {
    const response = await apiClient.post("/api/payments", data);
    return response.data;
  },

  /**
   * Get payments for a job
   * GET /api/payments/job/:jobId
   */
  getJobPayments: async (jobId) => {
    const response = await apiClient.get(`/api/payments/job/${jobId}`);
    return response.data;
  },

  /**
   * Get payment by ID
   * GET /api/payments/:id
   */
  getPaymentById: async (id) => {
    const response = await apiClient.get(`/api/payments/${id}`);
    return response.data;
  },

  /**
   * Get all payments
   * GET /api/payments
   */
  getPayments: async (params = {}) => {
    const response = await apiClient.get("/api/payments", { params });
    return response.data;
  },

  /**
   * Get wallet transactions
   * GET /api/payments/wallet/transactions
   */
  getTransactions: async (params = {}) => {
    const response = await apiClient.get("/api/payments/wallet/transactions", {
      params,
    });
    return response.data;
  },

  /**
   * Get wallet balance
   * GET /api/payments/wallet
   */
  getWallet: async () => {
    const response = await apiClient.get("/api/payments/wallet");
    return response.data;
  },

  /**
   * Request refund (sender only)
   * PUT /api/payments/:id/refund
   */
  requestRefund: async (paymentId, reason) => {
    const response = await apiClient.put(`/api/payments/${paymentId}/refund`, {
      reason,
    });
    return response.data;
  },

  /**
   * Withdraw funds from wallet
   * POST /api/payments/wallet/withdraw
   */
  withdrawFunds: async (data) => {
    const response = await apiClient.post("/api/payments/wallet/withdraw", data);
    return response.data;
  },
};
