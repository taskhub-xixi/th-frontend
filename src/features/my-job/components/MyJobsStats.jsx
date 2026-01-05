import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyJobsStats({ stats, loading }) {
  // Stats skeleton
  const renderStatsSkeleton = () => (
    <>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-border">
          <CardContent className="p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {loading ? (
        renderStatsSkeleton()
      ) : (
        <>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalJobs}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.activeJobs}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Total Applicants</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalApplicants}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
