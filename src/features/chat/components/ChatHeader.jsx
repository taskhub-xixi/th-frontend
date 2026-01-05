import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Phone, Video, MoreVertical } from "lucide-react";
import { getCompanyAvatar } from "@/lib/dicebearAvatar";

const ChatHeader = ({ selectedChat, formatTime }) => {
  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={selectedChat.other_user?.avatar || getCompanyAvatar({ name: selectedChat.other_user?.name })} />
            <AvatarFallback className="bg-blue-500 text-white">
              {selectedChat.other_user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          {selectedChat.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">
              {selectedChat.other_user?.name}
            </p>
            {selectedChat.online && (
              <Badge
                variant="outline"
                className="text-xs bg-green-50 text-green-700 border-green-200"
              >
                Online
              </Badge>
            )}
          </div>
          {selectedChat.job && (
            <p className="text-sm text-gray-600">
              {selectedChat.job.title} • {selectedChat.job.company}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700"
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700"
        >
          <Video className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              View Job Details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Mute Conversation
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600">
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;