import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, CheckCheck, Clock, File, Image } from "lucide-react";
import { Send } from "lucide-react";

const MessageSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
      >
        <Skeleton
          className={`h-16 ${i % 2 === 0 ? "w-48" : "w-56"} rounded-lg`}
        />
      </div>
    ))}
  </div>
);

const MessagesArea = ({
  loading,
  messages,
  selectedChat,
  formatTime,
  formatDate,
  scrollToBottom,
  messagesEndRef,
}) => {
  return (
    <ScrollArea className="flex-1 p-4">
      {loading.messages ? (
        <MessageSkeleton />
      ) : messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Send className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            Start the conversation by sending a message
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Group messages by date */}
          {(() => {
            const groupedMessages = {};
            messages.forEach((msg) => {
              const date = formatDate(msg.created_at);
              if (!groupedMessages[date]) {
                groupedMessages[date] = [];
              }
              groupedMessages[date].push(msg);
            });

            return Object.entries(groupedMessages).map(
              ([date, dateMessages]) => (
                <div key={date}>
                  <div className="flex items-center justify-center my-6">
                    <div className="px-4 py-1 bg-gray-100 rounded-full">
                      <span className="text-xs text-gray-600 font-medium">
                        {date}
                      </span>
                    </div>
                  </div>

                  {dateMessages.map((msg, index) => {
                    const showAvatar =
                      index === 0 ||
                      dateMessages[index - 1].sender_id !==
                        msg.sender_id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} mb-2`}
                      >
                        <div
                          className={`flex max-w-[70%] ${msg.isOwn ? "" : "items-end"}`}
                        >
                          {/* Avatar for received messages */}
                          {!msg.isOwn && showAvatar && (
                            <Avatar className="w-8 h-8 mr-2">
                              <AvatarFallback className="bg-blue-500 text-white text-xs">
                                {selectedChat.other_user?.name?.charAt(
                                  0
                                ) || "U"}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          {/* Spacer for sent messages */}
                          {msg.isOwn && <div className="w-10" />}

                          <div
                            className={`rounded-lg p-3 ${
                              msg.isOwn
                                ? "bg-blue-500 text-white rounded-tr-none"
                                : "bg-gray-100 text-gray-900 rounded-tl-none"
                            }`}
                          >
                            {/* File attachment */}
                            {msg.type === "file" && msg.file_url && (
                              <div className="mb-2">
                                {msg.type?.startsWith("image/") ? (
                                  <div className="relative">
                                    <img
                                      src={msg.file_url}
                                      alt="Attachment"
                                      className="max-w-full max-h-48 rounded-lg"
                                    />
                                    <a
                                      href={msg.file_url}
                                      download={msg.file_name}
                                      className="absolute bottom-2 right-2 bg-black/50 text-white p-1 rounded text-xs"
                                    >
                                      Download
                                    </a>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 p-3 bg-white/10 rounded">
                                    <File className="h-6 w-6" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {msg.file_name}
                                      </p>
                                      <p className="text-xs opacity-75">
                                        {/* Using file size from backend if available, otherwise default */}
                                        {msg.file_size ? (msg.file_size / 1024).toFixed(1) + " KB" : "N/A"}
                                      </p>
                                    </div>
                                    <a
                                      href={msg.file_url}
                                      download={msg.file_name}
                                      className="text-blue-400 hover:text-blue-300"
                                    >
                                      Download
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Message text */}
                            {msg.content && (
                              <p className="text-sm whitespace-pre-wrap">
                                {msg.content}
                              </p>
                            )}

                            {/* Message footer */}
                            <div
                              className={`flex items-center justify-between mt-1 ${
                                msg.isOwn
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              <span className="text-xs">
                                {formatTime(msg.created_at)}
                              </span>
                              {msg.isOwn && (
                                <span className="ml-2">
                                  {msg.status === "sent" && (
                                    <Check className="h-3 w-3" />
                                  )}
                                  {msg.status === "delivered" && (
                                    <CheckCheck className="h-3 w-3" />
                                  )}
                                  {msg.status === "read" && (
                                    <CheckCheck className="h-3 w-3 text-blue-300" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            );
          })()}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export { MessageSkeleton };
export default MessagesArea;