import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import  ApplicationCard  from "@/features/applications/components/ApplicationCard";
import { ApplicationSkeleton } from "@/features/applications/components/ApplicationSkeleton";
import EmptyState from "@/features/applications/components/EmptyState";
import Link from "next/link";
import { CheckCircle, User, Calendar } from "lucide-react";
import { getCompanyAvatar } from "@/lib/dicebearAvatar";

export default function ApplicantTabs({
  applicationsAsTasker = [],
  applicationsAsPosted = [],
  completedJobs = [],
  error,
  errorPosted,
  errorCompleted,
  loading,
  fetchApplicationsAsTasker,
  fetchApplicationsAsPosted,
  fetchCompletedJobs = () => {}
}) {
  return (
    <Tabs className="w-full" defaultValue="my-applications">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="my-applications">
          My Applications
          {applicationsAsTasker.length > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {applicationsAsTasker.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="job-applicants">
          Job Applicants
          {applicationsAsPosted.length > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {applicationsAsPosted.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="completed-jobs">
          Completed Jobs
          {completedJobs.length > 0 && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {completedJobs.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent className="space-y-4" value="my-applications">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">Track the status of your job applications</p>
          {applicationsAsTasker.length > 0 && (
            <Button
              className="h-8 px-3 text-xs md:text-sm"
              onClick={fetchApplicationsAsTasker}
              size="sm"
              variant="outline"
            >
              Refresh
            </Button>
          )}
        </div>

        {error ? (
          <Card className="border-border">
            <CardContent className="p-6 md:p-8 text-center">
              <p className="text-red-500 mb-4 text-sm md:text-base">{error}</p>
              <Button onClick={fetchApplicationsAsTasker} size="sm">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : applicationsAsTasker.length === 0 ? (
          <EmptyState
            buttonLink="/dashboard/jobs"
            buttonText="Browse Jobs"
            description="Apply to jobs to track your applications here"
            title="No applications yet"
          />
        ) : (
          <div className="space-y-4">
            {applicationsAsTasker.map((app) => (
              <ApplicationCard application={app} isPosted={false} key={app.id} />
            ))}
          </div>
        )}

        {applicationsAsTasker.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button asChild className="text-xs md:text-sm" size="sm" variant="outline">
              <Link href="/dashboard/jobs">Find More Jobs</Link>
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent className="space-y-4" value="job-applicants">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            View and manage applicants who applied to your job postings
          </p>
          {applicationsAsPosted.length > 0 && (
            <Button
              className="h-8 px-3 text-xs md:text-sm"
              onClick={fetchApplicationsAsPosted}
              size="sm"
              variant="outline"
            >
              Refresh
            </Button>
          )}
        </div>

        {errorPosted ? (
          <Card className="border-border">
            <CardContent className="p-6 md:p-8 text-center">
              <p className="text-red-500 mb-4 text-sm md:text-base">{errorPosted}</p>
              <Button onClick={fetchApplicationsAsPosted} size="sm">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : applicationsAsPosted.length === 0 ? (
          <EmptyState
            buttonLink="/dashboard/post-job"
            buttonText="Post a Job"
            description="When candidates apply to your jobs, they'll appear here"
            title="No applicants yet"
          />
        ) : (
          <div className="space-y-4">
            {applicationsAsPosted.map((app) => (
              <ApplicationCard application={app} isPosted={true} key={app.id} />
            ))}
          </div>
        )}

        {applicationsAsPosted.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button asChild className="text-xs md:text-sm" size="sm" variant="outline">
              <Link href="/dashboard/jobs">View My Jobs</Link>
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent className="space-y-4" value="completed-jobs">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">View your completed job history</p>
          {completedJobs.length > 0 && (
            <Button
              className="h-8 px-3 text-xs md:text-sm"
              onClick={fetchCompletedJobs}
              size="sm"
              variant="outline"
            >
              Refresh
            </Button>
          )}
        </div>

        {errorCompleted ? (
          <Card className="border-border">
            <CardContent className="p-6 md:p-8 text-center">
              <p className="text-red-500 mb-4 text-sm md:text-base">{errorCompleted}</p>
              <Button onClick={fetchCompletedJobs} size="sm">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : completedJobs.length === 0 ? (
          <Card className="border-border bg-gradient-to-b from-secondary/30 to-secondary/50">
            <CardContent className="py-12 md:py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl" />
                <div className="absolute inset-4 bg-background rounded-xl shadow-sm flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No Completed Jobs Yet</h2>
              <p className="text-gray-600 mb-6">
                Your completed jobs will appear here once you finish working on jobs
              </p>
              <Button asChild variant="outline">
                <Link href="/dashboard/jobs">Browse Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {completedJobs.map((job) => (
              <Card key={job.id} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-5">
                  <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img
                        src={getCompanyAvatar({ name: job.title })}
                        alt={job.title}
                        className="w-full h-full rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent((job.title || 'Job').substring(0, 2))}&background=10b981&color=fff&size=64`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base md:text-lg text-foreground line-clamp-2">
                            {job.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2">
                            {job.description?.substring(0, 100) || "No description available"}
                            ...
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-lg md:text-xl text-foreground whitespace-nowrap">
                            {job.budget ? `$${job.budget.toLocaleString()}` : "Negotiable"}
                          </p>
                          <span className="text-xs text-green-600">Completed</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 pb-4 mb-4 border-b border-border">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <User className="h-3 w-3 flex-shrink-0" />
                          {job.poster_name || "Job Poster"}
                        </span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="whitespace-nowrap">
                          {job.location || "Remote"}
                        </span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          {new Date(job.updated_at || job.completed_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {job.skills && Array.isArray(job.skills) && job.skills.length > 0 ? (
                            job.skills.slice(0, 3).map((skill, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="font-normal text-xs bg-green-50 text-green-700 border-green-200"
                              >
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No skills specified</span>
                          )}
                          {job.skills && Array.isArray(job.skills) && job.skills.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="font-normal text-xs bg-green-50 text-green-700 border-green-200"
                            >
                              +{job.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                        <Button
                          asChild
                          className="w-full sm:w-auto text-xs md:text-sm"
                          size="sm"
                          variant="outline"
                        >
                          <Link href={`/dashboard/jobs/${job.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {completedJobs.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button asChild className="text-xs md:text-sm" size="sm" variant="outline">
              <Link href="/dashboard/jobs">View All Jobs</Link>
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
