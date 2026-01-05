import { jobsApi } from "@/lib/api/jobs";
 // Fetch my jobs from API
  export const fetchMyJobs = async () => {
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
