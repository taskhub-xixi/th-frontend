import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import ConversationSkeleton from "./ConversationSkeleton";
import { getCompanyAvatar } from "@/lib/dicebearAvatar";

const ConversationSidebar = ({
  loading,
  selectedChat,
  conversations,
  searchQuery,
  filteredConversations,
  setSearchQuery,
  setSelectedChat,
  fetchMessages,
  formatTime,
}) => {
  return (
    <Card className="w-full lg:w-80 border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {loading.conversations ? (
          ""
          // <ConversationSkeleton />
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              No conversations
            </h3>
            <p className="text-sm text-gray-600">
              {searchQuery
                ? "No matches found"
                : "Start a conversation from job application"}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedChat(conv);
                  fetchMessages(conv.id);
                }}
                className={`w-full p-3 rounded-lg text-left transition-colors mb-1 ${
                  selectedChat?.id === conv.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conv.other_user?.avatar || getCompanyAvatar({ name: conv.other_user?.name })} />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {conv.other_user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {conv.other_user?.name || "User"}
                      </p>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTime(conv.updated_at)}
                      </span>
                    </div>
                    {conv.job && (
                      <p className="text-xs text-gray-600 mb-1 truncate">
                        {conv.job.title} • {conv.job.company}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 truncate">
                      {conv.last_message?.content || "No messages yet"}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500">
                      {conv.unread_count}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default ConversationSidebar;
