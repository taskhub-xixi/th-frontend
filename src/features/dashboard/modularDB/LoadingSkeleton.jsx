import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const LoadingSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <Skeleton className="h-48 flex-1" />
        <div className="flex flex-col gap-4 lg:w-96">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton className="h-24" key={i} />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton className="h-64" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;