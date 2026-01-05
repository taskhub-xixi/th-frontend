import apiClient from "@/lib/axios";

/**
 * Support API Service
 * Handles support tickets and customer support operations
 */

export const supportApi = {
  /**
   * Create a new support ticket
   * POST /api/support/tickets
   */
  createTicket: async (data) => {
    const response = await apiClient.post("/api/support/tickets", data);
    return response.data;
  },

  /**
   * Get all my support tickets
   * GET /api/support/tickets/my-tickets
   */
  getMyTickets: async (params = {}) => {
    const response = await apiClient.get("/api/support/tickets/my-tickets", { params });
    return response.data;
  },

  /**
   * Get support ticket by ID
   * GET /api/support/tickets/:id
   */
  getTicketById: async (ticketId) => {
    const response = await apiClient.get(`/api/support/tickets/${ticketId}`);
    return response.data;
  },

  /**
   * Update support ticket (add reply/comment)
   * PUT /api/support/tickets/:id
   */
  updateTicket: async (ticketId, data) => {
    const response = await apiClient.put(`/api/support/tickets/${ticketId}`, data);
    return response.data;
  },

  /**
   * Close support ticket
   * DELETE /api/support/tickets/:id
   */
  closeTicket: async (ticketId) => {
    const response = await apiClient.delete(`/api/support/tickets/${ticketId}`);
    return response.data;
  },
};
