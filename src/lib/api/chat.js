import apiClient from "@/lib/axios";

/**
 * Chat API Service
 * Handles messaging and conversation operations
 */

export const chatApi = {
  /**
   * Create new conversation
   * POST /api/chat/conversations
   */
  createConversation: async (data) => {
    const response = await apiClient.post("/api/chat/conversations", data);
    return response.data;
  },

  /**
   * Get conversation by ID
   * GET /api/chat/conversations/:id
   */
  getConversation: async (id) => {
    const response = await apiClient.get(`/api/chat/conversations/${id}`);
    return response.data;
  },

  /**
   * Get all conversations
   * GET /api/chat/conversations
   */
  getConversations: async () => {
    const response = await apiClient.get("/api/chat/conversations");
    return response.data;
  },

  /**
   * Send message
   * POST /api/chat/conversations/:conversation_id/messages
   */
  sendMessage: async (conversationId, data) => {
    const messageData = {
      message: data.content || data.message,
      message_type: data.type || data.message_type || 'text',
    };

    const response = await apiClient.post(
      `/api/chat/conversations/${conversationId}/messages`,
      messageData,
    );
    return response.data;
  },

  /**
   * Get messages for a conversation
   * GET /api/chat/conversations/:conversation_id/messages
   */
  getMessages: async (conversationId, params = {}) => {
    const response = await apiClient.get(
      `/api/chat/conversations/${conversationId}/messages`,
      { params },
    );
    return response.data;
  },

  /**
   * Get unread message count
   * GET /api/chat/unread-count
   */
  getUnreadCount: async () => {
    const response = await apiClient.get("/api/chat/unread-count");
    return response.data;
  },
};
