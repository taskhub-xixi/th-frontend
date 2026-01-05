import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const MessageList = ({ conversationId, currentUserId, messages: propMessages = [] }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef(null);

  // Use prop messages if provided, otherwise simulate loading
  useEffect(() => {
    if (propMessages.length > 0) {
      setMessages(propMessages);
      setLoading(false);
    } else {
      // Simulate loading messages from API
      setTimeout(() => {
        const dummyMessages = [
          {
            conversation_id: conversationId,
            created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            id: 1,
            message: "Hi there! I saw your job posting and I'm interested in helping you.",
            message_type: "text",
            read_status: true,
            sender_avatar: null,
            sender_id: currentUserId === 1 ? 2 : 1,
            sender_name: currentUserId === 1 ? "John Doe" : "Jane Smith",
          },
          {
            conversation_id: conversationId,
            created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
            id: 2,
            message: "Great! Can you tell me more about the job requirements?",
            message_type: "text",
            read_status: true,
            sender_avatar: null,
            sender_id: currentUserId,
            sender_name: currentUserId === 1 ? "Jane Smith" : "John Doe",
          },
          {
            conversation_id: conversationId,
            created_at: new Date().toISOString(), // now
            id: 3,
            message: "Sure! I need someone to help me move furniture this weekend.",
            message_type: "text",
            read_status: false,
            sender_avatar: null,
            sender_id: currentUserId === 1 ? 2 : 1,
            sender_name: currentUserId === 1 ? "John Doe" : "Jane Smith",
          },
        ];
        setMessages(dummyMessages);
        setLoading(false);
      }, 500);
    }
  }, [propMessages, conversationId, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = (now - date) / 1000;

    if (diffInSeconds < 60) {
      return "Just now";
    }
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    }
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            className={`flex ${message.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
            key={message.id}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender_id === currentUserId
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <div
                className={`text-xs mt-1 ${message.sender_id === currentUserId ? "text-blue-100" : "text-gray-500"}`}
              >
                {formatDate(message.created_at)}
                {message.sender_id !== currentUserId && !message.read_status && (
                  <span className="ml-1">• Unread</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
