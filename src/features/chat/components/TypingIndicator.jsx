import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TypingIndicator = ({ typing, selectedChat }) => {
  if (!typing) return null;

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center gap-2">
        <Avatar className="w-6 h-6">
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {selectedChat.other_user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex gap-1">
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;