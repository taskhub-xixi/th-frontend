"use client";

import MyJobsHeader from "./components/MyJobsHeader";
import MyJobsStats from "./components/MyJobsStats";
import MyJobsList from "./components/MyJobsList";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import MyJobsErrorState from "./components/MyJobsErrorState";
import { useMyJobs } from "./hooks/useMyJobs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MyJobs() {
  const router = useRouter();
  const {
    myJobs,
    loading,
    error,
    sortBy,
    setSortBy,
    stats,
    fetchMyJobs,
    deleteJob,
    isPoster
  } = useMyJobs();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Handle delete with confirmation
  const handleDelete = async (jobId) => {
    try {
      await deleteJob(jobId);
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    } catch (err) {
      console.error("Error deleting job:", err);
      alert(err.message || "Failed to delete job");
    }
  };

  // Open delete confirmation dialog
  const confirmDelete = (jobId) => {
    const job = myJobs.find(j => j.id === jobId);
    if (job) {
      setJobToDelete(jobId);
      setDeleteDialogOpen(true);
    }
  };

  // Navigate to edit job
  const handleEdit = (jobId) => {
    router.push(`/dashboard/jobs/${jobId}/edit`);
  };

  // View job details
  const handleView = (jobId) => {
    router.push(`/dashboard/jobs/${jobId}`);
  };

  // View applicants
  const handleViewApplicants = (jobId) => {
    router.push(`/dashboard/jobs/${jobId}/applicants`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <MyJobsHeader />
      <MyJobsStats stats={stats} loading={loading} />
      <MyJobsList
        myJobs={myJobs}
        loading={loading}
        error={error}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onEdit={handleEdit}
        onView={handleView}
        onViewApplicants={handleViewApplicants}
        onDelete={confirmDelete}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => jobToDelete && handleDelete(jobToDelete)}
        jobTitle={myJobs.find(j => j.id === jobToDelete)?.title || ""}
      />

      {/* Error State */}
      {error && !error.includes("poster") && (
        <MyJobsErrorState
          error={error}
          onRetry={fetchMyJobs}
          userRole={user?.role}
        />
      )}
    </div>
  );
}
