import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, Clock, Calendar, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useResponsive } from "@/hooks/responsive-context";

const RecentJobsSection = ({ recentJobs, loading, getCompanyAvatar }) => {
  const { isMobile } = useResponsive();

  // Sample company logos data
  const companyLogos = {
    AppDevCo: {
      bg: "bg-gradient-to-br from-orange-500 to-red-500",
      initial: "A",
    },
    CloudSystems: {
      bg: "bg-gradient-to-br from-cyan-500 to-blue-500",
      initial: "C",
    },
    DataLabs: {
      bg: "bg-gradient-to-br from-indigo-500 to-purple-500",
      initial: "D",
    },
    DesignStudio: {
      bg: "bg-gradient-to-br from-purple-500 to-pink-500",
      initial: "D",
    },
    TechCorp: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      initial: "T",
    },
    WebSolutions: {
      bg: "bg-gradient-to-br from-green-500 to-teal-500",
      initial: "W",
    },
  };

  // Get company logo data
  const getCompanyLogo = (companyName) => {
    if (!companyName) return { bg: "bg-gradient-to-br from-gray-500 to-gray-600", initial: "?" };

    const key = companyName.replace(/\s+/g, "");
    return (
      companyLogos[key] || {
        bg: `bg-gradient-to-br from-${["blue", "purple", "green", "red", "orange", "indigo"][companyName.length % 6]}-500 to-${["indigo", "pink", "teal", "orange", "yellow", "purple"][companyName.length % 6]}-500`,
        initial: companyName.charAt(0).toUpperCase(),
      }
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Recent Job Listings
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Latest opportunities matching your profile
          </p>
        </div>
        <Link
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          href="/dashboard/jobs"
        >
          See all jobs
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {loading.jobs ? (
        <div
          className={
            isMobile
              ? "grid grid-cols-1 gap-4"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          }
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <Card className="p-4" key={i}>
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-5 w-5" />
              </div>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      ) : recentJobs.length > 0 ? (
        <div
          className={
            isMobile
              ? "grid grid-cols-1 gap-4"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          }
        >
          {recentJobs.slice(0, 3).map((job) => {
            const companyAvatar = getCompanyAvatar({
              id: job.company_id || job.id,
              name: job.company || "Unknown Company",
            });
            return (
              <Card
                className="border-border hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                key={job.id}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={companyAvatar}
                        alt={job.company || "Company"}
                        className="w-10 h-10 rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {job.company || "Company"}
                        </h3>
                        <p className="text-sm text-muted-foreground">{job.title}</p>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="font-semibold text-foreground mb-4">
                    $ {job.budget?.toLocaleString() || "Negotiable"}
                  </p>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{job.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>Full-time</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>
                        {job.created_at
                          ? new Date(job.created_at).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recently"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {job.created_at
                        ? new Date(job.created_at).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                          })
                        : "Recently"}
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/jobs/${job.id}`}>View Job</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No jobs available yet</h3>
          <p className="text-muted-foreground mb-6">
            Check back later or post a job to get started.
          </p>
          <Button asChild>
            <Link href="/dashboard/post-job">Post a Job</Link>
          </Button>
        </Card>
      )}
    </section>
  );
};

export default RecentJobsSection;