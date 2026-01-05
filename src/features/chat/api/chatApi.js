// src/features/chat/api/chatApi.js
import apiClient from "@/lib/axios";

// Create a new conversation
export const createConversation = async (jobId, otherUserId) => {
  const response = await apiClient.post("/api/chat/conversations", {
    job_id: jobId,
    other_user_id: otherUserId,
  });
  return response.data;
};

// Get conversation by ID
export const getConversationById = async (id) => {
  const response = await apiClient.get(`/api/chat/conversations/${id}`);
  return response.data;
};

// Get all conversations for user
export const getConversationsForUser = async () => {
  const response = await apiClient.get("/api/chat/conversations");
  return response.data;
};

// Send a message
export const sendMessage = async (conversationId, message, messageType = "text") => {
  const response = await apiClient.post(`/api/chat/conversations/${conversationId}/messages`, {
    message,
    message_type: messageType,
  });
  return response.data;
};

// Get messages for conversation
export const getMessages = async (conversationId, limit = 50, offset = 0) => {
  const params = new URLSearchParams();
  params.append("limit", limit);
  params.append("offset", offset);

  const response = await apiClient.get(
    `/api/chat/conversations/${conversationId}/messages?${params}`,
  );
  return response.data;
};

// Get unread message count
export const getUnreadCount = async () => {
  const response = await apiClient.get("/api/chat/unread-count");
  return response.data;
};
