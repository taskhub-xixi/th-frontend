import { useState, useEffect } from "react";
import { jobsApi } from "@/lib/api/jobs";
import { useAuth } from "@/context/AuthContext";

export function useMyJobs() {
  const { user } = useAuth();
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
  });

  // Check if user is poster
  const isPoster = user?.role === "poster";

  // Fetch my jobs from API
  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check role before fetching
      if (!isPoster) {
        setError("Only posters can access this page. Please switch to poster role.");
        setLoading(false);
        return;
      }

      // Menggunakan API untuk mengambil jobs yang diposting oleh user
      const response = await jobsApi.getMyJobs({
        sortBy: sortBy === "newest" ? "created_at" : "created_at",
        sortOrder: sortBy === "newest" ? "desc" : "asc",
      });

      const jobs = response.jobs || [];
      setMyJobs(jobs);

      // Calculate stats
      const activeJobsCount = jobs.filter(
        (job) => job.status === "active" || job.status === "published"
      ).length;
      const totalApplicants = jobs.reduce(
        (sum, job) => sum + (job.applicants_count || 0),
        0
      );

      setStats({
        totalJobs: jobs.length,
        activeJobs: activeJobsCount,
        totalApplicants: totalApplicants,
      });
    } catch (err) {
      console.error("Error fetching my jobs:", err);
      setError(err.message || "Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const deleteJob = async (jobId) => {
    try {
      await jobsApi.deleteJob(jobId);
      // Remove from local state
      setMyJobs((prev) => prev.filter((job) => job.id !== jobId));
      // Update stats
      setStats((prev) => ({
        ...prev,
        totalJobs: prev.totalJobs - 1,
      }));
    } catch (err) {
      console.error("Error deleting job:", err);
      throw new Error("Failed to delete job");
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyJobs();
    }
  }, [user, sortBy]);

  return {
    myJobs,
    loading,
    error,
    sortBy,
    setSortBy,
    stats,
    fetchMyJobs,
    deleteJob,
    isPoster
  };
}