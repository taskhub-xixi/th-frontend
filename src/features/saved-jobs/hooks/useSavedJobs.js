import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { showErrorToast } from "@/lib/errorHandler";
import { jobsApi } from "@/lib/api/jobs";

export const useSavedJobs = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedJobs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await jobsApi.getSavedJobs();

      if (response.success && response.savedJobs) {
        setSavedJobs(response.savedJobs);
      } else if (response.jobs) {
        setSavedJobs(response.jobs);
      } else {
        setSavedJobs([]);
      }
    } catch (err) {
      const errorInfo = showErrorToast(err, "Failed to load saved jobs");

      if (err.response?.status === 401) {
        setError(errorInfo.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(errorInfo.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (jobId) => {
    try {
      await jobsApi.unsaveJob(jobId);
      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      showErrorToast(err, "Failed to remove job from saved");
    }
  };

  const handleToggleSave = async (jobId) => {
    try {
      const isCurrentlySaved = savedJobs.some((job) => job.id === jobId);

      if (isCurrentlySaved) {
        await jobsApi.unsaveJob(jobId);
        setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
      } else {
        await jobsApi.saveJob(jobId);
        await fetchSavedJobs();
      }
    } catch (err) {
      showErrorToast(err, "Failed to update saved jobs");
    }
  };

  const getSortedJobs = () => {
    return [...savedJobs].sort((a, b) => {
      return (
        new Date(b.created_at || b.saved_at) -
        new Date(a.created_at || a.saved_at)
      );
    });
  };

  const formatBudget = (budget) => {
    if (!budget) return "N/A";
    if (budget >= 1000) {
      return `$${(budget / 1000).toFixed(0)}k`;
    }
    return `$${budget.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSkills = (job) => {
    if (job.skills && typeof job.skills === "string") {
      return job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }
    if (Array.isArray(job.skills)) {
      return job.skills;
    }
    return [];
  };

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  return {
    savedJobs,
    loading,
    error,
    fetchSavedJobs,
    handleRemoveSaved,
    handleToggleSave,
    getSortedJobs,
    formatBudget,
    formatDate,
    getSkills,
  };
};
