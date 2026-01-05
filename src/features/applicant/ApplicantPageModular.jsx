"use client";

import { useApplicant } from "@/features/applicant/hooks/useApplicant";
import ApplicantTabs from "@/features/applicant/components/ApplicantTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ApplicantPageModular() {
  const {
    applicationsAsTasker,
    applicationsAsPosted,
    completedJobs,
    loading,
    error,
    errorPosted,
    errorCompleted,
    fetchApplicationsAsTasker,
    fetchApplicationsAsPosted,
    fetchCompletedJobs
  } = useApplicant();

  const renderSkeleton = () => (
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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Applications & Applicants
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>{renderSkeleton()}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Applications & Applicants
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Manage your job applications and view applicants for your posted jobs
        </p>
      </div>

      <ApplicantTabs
        applicationsAsTasker={applicationsAsTasker}
        applicationsAsPosted={applicationsAsPosted}
        completedJobs={completedJobs}
        error={error}
        errorPosted={errorPosted}
        errorCompleted={errorCompleted}
        loading={loading}
        fetchApplicationsAsTasker={fetchApplicationsAsTasker}
        fetchApplicationsAsPosted={fetchApplicationsAsPosted}
        fetchCompletedJobs={fetchCompletedJobs}
      />
    </div>
  );
}