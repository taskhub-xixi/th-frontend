"use client";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { chatApi } from "@/lib/api/chat";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import ConversationSidebar from "./components/ConversationSidebar";
import ChatHeader from "./components/ChatHeader";
import MessagesArea from "./components/MessagesArea";
import MessageInput from "./components/MessageInput";
import AttachmentPreview from "./components/AttachmentPreview";
import TypingIndicator from "./components/TypingIndicator";

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState({
    conversations: true,
    messages: true,
  });
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [typing, setTyping] = useState(false);

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      hour12: false,
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading((prev) => ({ ...prev, conversations: true }));
      const response = await chatApi.getConversations();
      // Backend returns conversations in 'conversations' field
      const fetchedConversations = response.conversations || response.data || [];

      // Map backend response to frontend format
      const mappedConversations = fetchedConversations.map((conv) => ({
        id: conv.id,
        job: {
          company: conv.job_company || "Unknown Company", // Assuming company might not be in backend
          title: conv.job_title,
        },
        last_message: { content: conv.last_message },
        online: conv.is_online, // Backend might not have this field
        other_user:
          conv.participant1_id === user.id
            ? {
                avatar: conv.participant2_avatar,
                name: conv.participant2_name,
              }
            : {
                avatar: conv.participant1_avatar,
                name: conv.participant1_name,
              },
        unread_count: conv.unread_count,
        updated_at: conv.updated_at || conv.last_message_time,
      }));

      setConversations(mappedConversations);

      // Select first conversation if none selected
      if (mappedConversations.length > 0 && !selectedChat) {
        setSelectedChat(mappedConversations[0]);
        fetchMessages(mappedConversations[0].id);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        description: "Failed to load conversations",
        title: "Error",
        variant: "destructive",
      });
      // Fallback to mock data if API fails
      setConversations(mockConversations);
      if (!selectedChat) {
        setSelectedChat(mockConversations[0]);
        setMessages(mockMessages);
      }
    } finally {
      setLoading((prev) => ({ ...prev, conversations: false }));
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;

    try {
      setLoading((prev) => ({ ...prev, messages: true }));
      const response = await chatApi.getMessages(conversationId);
      // Backend returns messages in 'messages' field
      const fetchedMessages = response.messages || response.data || [];

      // Map backend response to frontend format
      const mappedMessages = fetchedMessages.map((msg) => ({
        content: msg.message, // Backend uses 'message' field
        created_at: msg.created_at || msg.created_at,
        file_name: msg.file_name || null,
        file_url: msg.file_url || null,
        id: msg.id,
        isOwn: msg.sender_id === user.id,
        sender_id: msg.sender_id,
        status: msg.read_status ? "read" : "delivered", // Backend uses 'read_status' field
        type: msg.message_type || "text", // Backend uses 'message_type' field
      }));

      setMessages(mappedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        description: "Failed to load messages",
        title: "Error",
        variant: "destructive",
      });
      // Fallback to mock data
      setMessages(mockMessages);
    } finally {
      setLoading((prev) => ({ ...prev, messages: false }));
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!(newMessage.trim() || attachment)) return;
    if (!selectedChat) return;

    setSending(true);

    try {
      const messageData = {
        content: newMessage,
        file_name: attachment?.name || null,
        file_type: attachment?.type || null,
        file_url: attachment ? URL.createObjectURL(attachment) : null,
        type: attachment ? "file" : "text",
      };

      // Send via API
      const response = await chatApi.sendMessage(selectedChat.id, messageData);

      // Add to local state
      const newMessageObj = {
        content: newMessage,
        created_at: new Date().toISOString(),
        file_name: attachment?.name || null,
        file_url: attachment ? URL.createObjectURL(attachment) : null,
        id: response.message?.id || Date.now(), // Use ID from response if available
        isOwn: true,
        sender_id: user.id,
        status: "sent",
        type: messageData.message_type || messageData.type || "text",
      };

      setMessages((prev) => [...prev, newMessageObj]);

      // Clear input and attachment
      setNewMessage("");
      setAttachment(null);
      setAttachmentPreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        description: "Failed to send message",
        title: "Error",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  // Handle file attachment
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        description: "Maximum file size is 5MB",
        title: "File too large",
        variant: "destructive",
      });
      return;
    }

    setAttachment(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove attachment
  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter conversations
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.other_user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Load data on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock data for fallback
  const mockConversations = [
    {
      id: 1,
      job: { company: "Atlassian", title: "Product Manager" },
      last_message: { content: "We'd like to schedule an interview" },
      online: true,
      other_user: { avatar: null, name: "Atlassian HR" },
      unread_count: 2,
      updated_at: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
      id: 2,
      job: { company: "Netflix", title: "Senior UX Designer" },
      last_message: { content: "Thanks for your application" },
      online: true,
      other_user: { avatar: null, name: "Sarah Chen" },
      unread_count: 0,
      updated_at: new Date(Date.now() - 60 * 60000).toISOString(),
    },
  ];

  const mockMessages = [
    {
      content: "Hello! Thank you for applying to the Product Manager position.",
      created_at: new Date(Date.now() - 30 * 60000).toISOString(),
      id: 1,
      isOwn: false,
      sender_id: 2,
      status: "read",
      type: "text",
    },
    {
      content: "Hi! Thank you for reaching out. I'm very interested in this opportunity.",
      created_at: new Date(Date.now() - 28 * 60000).toISOString(),
      id: 2,
      isOwn: true,
      sender_id: 1,
      status: "read",
      type: "text",
    },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4 p-4 md:p-6">
      {/* Conversations Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        fetchMessages={fetchMessages}
        filteredConversations={filteredConversations}
        formatTime={formatTime}
        loading={loading}
        searchQuery={searchQuery}
        selectedChat={selectedChat}
        setSearchQuery={setSearchQuery}
        setSelectedChat={setSelectedChat}
      />

      {/* Chat Area */}
      <Card className="flex-1 border-gray-200 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <ChatHeader formatTime={formatTime} selectedChat={selectedChat} />

            {/* Messages Area */}
            <MessagesArea
              formatDate={formatDate}
              formatTime={formatTime}
              loading={loading}
              messages={messages}
              messagesEndRef={messagesEndRef}
              scrollToBottom={scrollToBottom}
              selectedChat={selectedChat}
            />

            {/* Typing indicator */}
            <TypingIndicator selectedChat={selectedChat} typing={typing} />

            {/* Attachment preview */}
            {attachment && (
              <AttachmentPreview attachment={attachment} removeAttachment={removeAttachment} />
            )}

            {/* Message Input */}
            <MessageInput
              attachment={attachment}
              fileInputRef={fileInputRef}
              handleFileSelect={handleFileSelect}
              newMessage={newMessage}
              sending={sending}
              sendMessage={sendMessage}
              setNewMessage={setNewMessage}
            />
          </>
        ) : (
          // No chat selected state
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Send className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Messages</h2>
            <p className="text-gray-600 text-center max-w-md mb-8">
              Select a conversation to start messaging, or create a new one from a job application
            </p>
            <div className="flex gap-3">
              <Button onClick={fetchConversations} variant="outline">
                Refresh Conversations
              </Button>
              <Button>Browse Jobs</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
