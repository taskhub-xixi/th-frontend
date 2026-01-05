import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SavedJobsSkeleton() {
  const renderSkeletonCard = () => (
    <Card className="border-border">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
          <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
              <div className="flex-1">
                <Skeleton className="h-5 w-48 mb-1" />
                <Skeleton className="h-4 w-full sm:w-3/4" />
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-24 mb-2 ml-auto" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i}>{renderSkeletonCard()}</div>
      ))}
    </div>
  );
}
