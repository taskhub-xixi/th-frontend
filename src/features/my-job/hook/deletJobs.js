  import { jobsApi } from "@/lib/api/jobs";
  // Delete job
  export const handleDelete = async (jobId) => {
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
      alert("Failed to delete job");
    } finally {
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };
