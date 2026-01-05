/**
 * Custom hooks for jobs feature
 */

import { useState, useEffect, useCallback } from "react";
import { jobsApi } from "@/lib/api/jobs";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook to fetch and manage jobs list
 */
export function useJobs(filters = {}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await jobsApi.getJobs(filters);

      if (response.success) {
        setJobs(response.jobs || []);
      } else {
        setError(response.message || "Failed to fetch jobs");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching jobs");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, refetch: fetchJobs };
}

/**
 * Hook to fetch and manage a single job
 */
export function useJob(jobId) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await jobsApi.getJobById(jobId);
        const jobData = response.job || response;

        setJob(jobData);
      } catch (err) {
        setError(err.message || "Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  return { job, loading, error };
}

/**
 * Hook to manage saved jobs
 */
export function useSavedJobs() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) {
        setSavedJobs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await jobsApi.getSavedJobs();

        if (response.success) {
          setSavedJobs(response.savedJobs || []);
        }
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user]);

  const toggleSave = useCallback(
    async (jobId) => {
      if (!user) return;

      try {
        await jobsApi.toggleSaveJob(jobId);

        if (savedJobs.includes(jobId)) {
          setSavedJobs(savedJobs.filter((id) => id !== jobId));
        } else {
          setSavedJobs([...savedJobs, jobId]);
        }
      } catch (err) {
        console.error("Failed to toggle save job:", err);
      }
    },
    [user, savedJobs],
  );

  return { savedJobs, loading, toggleSave };
}

/**
 * Hook to check if a job is applied
 */
export function useAppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    setAppliedJobs(stored);
  }, []);

  const markApplied = useCallback(
    (jobId) => {
      if (!appliedJobs.includes(jobId)) {
        const newApplied = [...appliedJobs, jobId];
        setAppliedJobs(newApplied);
        localStorage.setItem("appliedJobs", JSON.stringify(newApplied));
      }
    },
    [appliedJobs],
  );

  return { appliedJobs, markApplied, isApplied: (jobId) => appliedJobs.includes(jobId) };
}
