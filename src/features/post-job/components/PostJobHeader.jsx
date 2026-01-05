import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PostJobHeader({ jobId, onBack }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button className="h-8 w-8 p-0" onClick={onBack} size="sm" variant="ghost">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{jobId ? "Edit Job" : "Post a Job"}</h1>
        </div>
        <p className="text-gray-600">
          {jobId
            ? "Update your job listing details"
            : "Create a new job listing to find talented taskers"}
        </p>
      </div>

      {jobId && (
        <div className="self-start sm:self-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50">
            Editing: {jobId}
          </span>
        </div>
      )}
    </div>
  );
}
