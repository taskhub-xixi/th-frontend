import { Button } from "@/components/ui/button";

export default function PostJobActions({
  isSubmitting,
  isSavingDraft,
  jobId,
  onSaveDraft,
  onPublish,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border border-gray-200 rounded-lg bg-gray-50">
      <div className="text-sm text-gray-600">
        <p className="font-medium">Ready to find the right tasker?</p>
        <p>Publish your job to make it visible to our community.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          className="w-full sm:w-auto"
          disabled={isSubmitting || isSavingDraft}
          onClick={onSaveDraft}
          variant="outline"
          type="button"
        >
          {isSavingDraft ? "Saving..." : jobId ? "Update Draft" : "Save as Draft"}
        </Button>

        <Button
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting || isSavingDraft}
          onClick={onPublish}
          type="button"
        >
          {isSubmitting ? "Publishing..." : jobId ? "Update & Publish" : "Publish Job"}
        </Button>
      </div>
    </div>
  );
}
