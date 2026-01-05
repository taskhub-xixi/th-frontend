import { Button } from "@/components/ui/button";
import MyJobCard from "./MyJobCard";
import MyJobsEmptyState from "./MyJobsEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function MyJobsList({
  myJobs,
  loading,
  error,
  sortBy,
  setSortBy,
  onEdit,
  onView,
  onViewApplicants,
  onDelete
}) {
  // Loading skeleton
  const renderSkeleton = () => (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Skeleton className="h-5 w-48 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Your Job Listings
        </h2>
        {myJobs.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Sort by:</span>
            <div className="flex items-center gap-1">
              <Button
                variant={sortBy === "newest" ? "outline" : "ghost"}
                size="sm"
                onClick={() => setSortBy("newest")}
                className="h-8 px-3"
              >
                Newest
              </Button>
              <Button
                variant={sortBy === "oldest" ? "outline" : "ghost"}
                size="sm"
                onClick={() => setSortBy("oldest")}
                className="h-8 px-3"
              >
                Oldest
              </Button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>{renderSkeleton()}</div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          {error}
        </div>
      ) : myJobs.length === 0 ? (
        <MyJobsEmptyState />
      ) : (
        <div className="space-y-4">
          {myJobs.map((job) => (
            <MyJobCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onView={onView}
              onViewApplicants={onViewApplicants}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
