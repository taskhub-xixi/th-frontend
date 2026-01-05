import { Button } from "@/components/ui/button";

export function SavedJobsHeader({ savedJobsCount, onRefresh }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Saved Jobs
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Jobs you&apos;ve saved for later.{" "}
          {savedJobsCount > 0 && `(${savedJobsCount} jobs)`}
        </p>
      </div>

      {savedJobsCount > 0 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-8 px-3 text-xs md:text-sm"
          >
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
}
