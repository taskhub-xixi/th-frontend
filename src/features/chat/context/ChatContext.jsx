// src/features/chat/context/ChatContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [socket, setSocket] = useState(null);

  // In a real implementation, you would connect to a WebSocket server
  // For now, we'll simulate with dummy data
  useEffect(() => {
    if (user) {
      // Simulate connecting to a chat server
      console.log("Connecting to chat server...");

      // Simulate receiving initial data
      const dummyConversations = [
        {
          id: 1,
          job_id: 1,
          job_title: "Fix my laptop",
          last_message: "Can you do it tomorrow?",
          last_message_time: new Date(Date.now() - 3600000).toISOString(),
          participant1_id: 1,
          participant1_name: "John Doe",
          participant2_id: 2,
          participant2_name: "Jane Smith",
          unread_count: 1,
        },
      ];

      setConversations(dummyConversations);
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [user]);

  const value = {
    activeConversation,
    conversations,
    messages,
    setActiveConversation,
    setConversations,
    setMessages,
    setSocket,
    setUnreadCounts,
    socket,
    unreadCounts,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
