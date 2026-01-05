import { Button } from "@/components/ui/button";
import { File, Image, X } from "lucide-react";

const AttachmentPreview = ({ attachment, removeAttachment }) => {
  return (
    <div className="px-4 pb-2">
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          {attachment.type.startsWith("image/") ? (
            <Image className="h-8 w-8 text-blue-500" />
          ) : (
            <File className="h-8 w-8 text-blue-500" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
              {attachment.name}
            </p>
            <p className="text-xs text-gray-600">
              {(attachment.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={removeAttachment}
          className="h-8 w-8 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AttachmentPreview;