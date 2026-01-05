import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, Eye, CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useResponsive } from "@/hooks/responsive-context";

const ApplicantsSection = ({ user, applicants, loading, getStatusBadge, getUserAvatar }) => {
  const { isMobile } = useResponsive();

  if (user?.role !== "poster" && user?.role !== "tasker") {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            {user?.role === "poster" ? "Recent Applicants" : "Recent Applications"}
          </h2>
        </div>
        <Link
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          href={user?.role === "poster" ? "/dashboard/my-jobs" : "/dashboard/applicant"}
        >
          See all {user?.role === "poster" ? "applicants" : "applications"}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {loading.applicants ? (
        <div
          className={isMobile ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <Card className="p-4" key={i}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      ) : applicants.length > 0 ? (
        <div
          className={isMobile ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}
        >
          {applicants.slice(0, 4).map((applicant) => {
            const userAvatar = getUserAvatar({
              email: applicant.user?.email,
              id: applicant.user?.id,
              name: applicant.user?.name,
            });
            return (
              <Card className="border-border hover:shadow-md transition-shadow" key={applicant.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        alt={applicant.user?.name || "User"}
                        className="w-10 h-10 rounded-full"
                        src={userAvatar}
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {applicant.user?.name || "Applicant"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Applied for{" "}
                          <span className="font-medium">{applicant.job?.title || "Job"}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {applicant.user?.experience || "Experience not specified"}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(applicant.status)}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">
                      Applied{" "}
                      {new Date(applicant.applied_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/dashboard/applicants/${applicant.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/applicants/${applicant.id}/review`}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Review
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {user?.role === "poster" ? "No applicants yet" : "No applications yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {user?.role === "poster"
              ? "When candidates apply to your jobs, they'll appear here."
              : "When you apply to jobs, they'll appear here."}
          </p>
          <Button asChild>
            <Link href={user?.role === "poster" ? "/dashboard/post-job" : "/dashboard/jobs"}>
              {user?.role === "poster" ? "Post a Job" : "Browse Jobs"}
            </Link>
          </Button>
        </Card>
      )}
    </section>
  );
};

export default ApplicantsSection;
