import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, Smile, SendHorizonal, Clock } from "lucide-react";

const MessageInput = ({
  newMessage,
  setNewMessage,
  sendMessage,
  sending,
  fileInputRef,
  handleFileSelect,
  attachment,
}) => {
  return (
    <div className="p-4 border-t border-gray-200">
      <form onSubmit={sendMessage} className="space-y-3">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[60px] max-h-[120px] resize-none border-gray-300"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
            />
          </div>

          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                document.getElementById("file-upload").click()
              }
              className="text-gray-500 hover:text-gray-700"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
            >
              <Smile className="h-5 w-5" />
            </Button>

            <Button
              type="submit"
              size="icon"
              disabled={(!(newMessage.trim() || attachment)) || sending}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {sending ? (
                <Clock className="h-5 w-5 animate-spin" />
              ) : (
                <SendHorizonal className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  );
};

export default MessageInput;