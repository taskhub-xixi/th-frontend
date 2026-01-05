import { useAuth } from "@/context/AuthContext";
import { applicationsApi } from "@/lib/api/applications";
import { jobsApi } from "@/lib/api/jobs";
import { showErrorToast } from "@/lib/errorHandler";
import { useEffect, useState } from "react";

export function useApplicant() {
  const { user } = useAuth();
  const [applicationsAsTasker, setApplicationsAsTasker] = useState([]);
  const [applicationsAsPosted, setApplicationsAsPosted] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorPosted, setErrorPosted] = useState(null);
  const [errorCompleted, setErrorCompleted] = useState(null);

  const fetchApplicationsAsTasker = async () => {
    try {
      setError(null);
      const response = await applicationsApi.getMyApplications();
      if (response.success && response.applications) {
        setApplicationsAsTasker(response.applications);
      } else if (response.message?.includes("requires 'tasker' role")) {
        // Bypass: Jika user bukan tasker, set empty array
        setApplicationsAsTasker([]);
      } else {
        setApplicationsAsTasker([]);
      }
    } catch (err) {
      // Bypass: Handle 403 Forbidden atau role error
      if (
        err.response?.status === 403 ||
        err.response?.data?.message?.includes("requires 'tasker' role")
      ) {
        setApplicationsAsTasker([]);
      } else {
        const errorInfo = showErrorToast(err, "Failed to load applications");
        setError(errorInfo.message);
      }
    }
  };

  const fetchApplicationsAsPosted = async () => {
    try {
      setErrorPosted(null);
      const myJobsResponse = await jobsApi.getMyJobs({ limit: 50 });
      const jobs = myJobsResponse.jobs || [];

      if (jobs.length === 0) {
        setErrorPosted(
          "You haven't posted any jobs yet. Post your first job to start receiving applicants.",
        );
        setApplicationsAsPosted([]);
        return;
      }

      const allApplicants = [];
      for (const job of jobs) {
        try {
          const applicantsResponse = await applicationsApi.getJobApplications(job.id);
          const applicants = applicantsResponse.applications || [];
          allApplicants.push(...applicants);
        } catch (err) {
          // Bypass: Handle 403 Forbidden untuk job applications
          if (
            err.response?.status === 403 ||
            err.response?.data?.message?.includes("requires 'poster' role")
          ) {
            console.log(`No access to applicants for job ${job.id}`);
          } else if (err.response?.status === 404) {
            console.log(`No applicants found for job ${job.id} (${job.title}), skipping...`);
          } else {
            console.error(`Error fetching applicants for job ${job.id} (${job.title}):`, err);
          }
        }
      }

      const validApplicants = allApplicants.filter(
        (app) => app.status !== undefined && app.status !== null,
      );
      setApplicationsAsPosted(validApplicants);
    } catch (err) {
      // Bypass: Handle role errors gracefully
      if (
        err.response?.status === 403 ||
        err.response?.data?.message?.includes("requires 'poster' role")
      ) {
        setApplicationsAsPosted([]);
      } else {
        const errorInfo = showErrorToast(err, "Failed to load job applicants");
        setErrorPosted(errorInfo.message);
      }
    }
  };

  // Fetch completed jobs
  const fetchCompletedJobs = async () => {
    try {
      setErrorCompleted(null);

      // Get all jobs with status 'completed'
      const response = await jobsApi.getJobs({
        status: 'completed',
        limit: 50
      });

      if (response.success) {
        setCompletedJobs(response.jobs || []);
      } else {
        setCompletedJobs([]);
      }
    } catch (err) {
      // Bypass: Handle 403 Forbidden atau role error
      if (
        err.response?.status === 403 ||
        err.response?.data?.message?.includes("requires 'tasker' role") ||
        err.response?.data?.message?.includes("requires 'poster' role")
      ) {
        setCompletedJobs([]);
      } else {
        const errorInfo = showErrorToast(err, "Failed to load completed jobs");
        setErrorCompleted(errorInfo.message);
      }
    }
  };

  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchApplicationsAsTasker(),
        fetchApplicationsAsPosted(),
        fetchCompletedJobs()
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Reset state saat user/role berubah
      setApplicationsAsTasker([]);
      setApplicationsAsPosted([]);
      setCompletedJobs([]);
      setError(null);
      setErrorPosted(null);
      setErrorCompleted(null);
      fetchAllApplications();
    }
  }, [user]);

  return {
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
  };
}