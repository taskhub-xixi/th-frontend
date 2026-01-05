"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import JobForm from "@/features/jobs/components/JobForm";
import { handleApiError, showErrorToast } from "@/lib/errorHandler";
import { jobsApi } from "@/lib/api/jobs";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();

  // Validasi dan ekstrak jobId
  const jobId =
    typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : undefined;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJob = useCallback(async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await jobsApi.getJobById(id);

      if (response.success) {
        setJob(response.job);
        setError(null);
      } else {
        const errorInfo = handleApiError(
          new Error(response.message || "Failed to load job"),
          "Failed to load job",
        );
        setError(errorInfo.message);
      }
    } catch (err) {
      const errorInfo = showErrorToast(err, "Failed to load job details");
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!jobId) {
      router.push("/dashboard/my-jobs");
      return;
    }

    // Reset state saat jobId berubah
    setJob(null);
    setError(null);

    fetchJob(jobId);
  }, [jobId, router, fetchJob]);

  // Handle redirect error dengan cleanup
  useEffect(() => {
    let redirectTimeout;

    if (error && !loading) {
      redirectTimeout = setTimeout(() => {
        router.push("/dashboard/my-jobs");
      }, 2000);
    }

    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [error, loading, router]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <p className="text-sm text-red-600 mb-4">Redirecting to My Jobs in 2 seconds...</p>
            <Button onClick={() => router.push("/dashboard/my-jobs")}>Back to My Jobs</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-700 mb-4">Job not found</p>
            <Button onClick={() => router.push("/dashboard/my-jobs")}>Back to My Jobs</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        {/* <h1 className="text-3xl font-bold mb-2">Edit Job</h1>
        <p className="text-gray-600">Update your job posting details</p>*/}
      </div>
      <JobForm initialData={job} jobId={jobId} mode="edit" />
    </div>
  );
}
