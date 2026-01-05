import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { jobsApi } from "@/lib/api/jobs";
import { applicationsApi } from "@/lib/api/applications";
import { showErrorToast } from "@/lib/errorHandler";
import { Badge } from "@/components/ui/badge";

export const useDashboardData = () => {
  const { user } = useAuth();
  const [recentJobs, setRecentJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [stats, setStats] = useState({
    applications: 0,
    availableJobs: 0,
    balance: 0,
    interviews: 0,
    messages: 0,
    savedJobs: 0,
  });
  const [loading, setLoading] = useState({
    applicants: true,
    jobs: true,
    stats: true,
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading({ applicants: true, jobs: true, stats: true });

      // Fetch recent jobs
      const jobsResponse = await jobsApi.getJobs({
        limit: 6,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      setRecentJobs(jobsResponse.jobs?.slice(0, 6) || []);
      setLoading((prev) => ({ ...prev, jobs: false }));

      // Fetch stats
      const statsResponse = await fetchDashboardStats();
      setStats(statsResponse);
      setLoading((prev) => ({ ...prev, stats: false }));

      // Fetch based on user role
      if (user?.role === "tasker") {
        try {
          const applicationsResponse = await applicationsApi.getMyApplications();
          setApplicants(applicationsResponse.applications?.slice(0, 4) || []);
        } catch (error) {
          showErrorToast(error, "Failed to load your applications");
        }
      } else if (user?.role === "poster") {
        try {
          const myJobsResponse = await jobsApi.getMyJobs({ limit: 10 });
          const jobs = myJobsResponse.jobs || [];

          const allApplicants = [];
          for (const job of jobs) {
            const jobApplicantsResponse = await applicationsApi.getJobApplications(job.id);
            const jobApplicants = jobApplicantsResponse.applications || [];
            allApplicants.push(...jobApplicants);
          }

          setApplicants(allApplicants.slice(0, 4));
        } catch (error) {
          showErrorToast(error, "Failed to load applicants");
        }
      }
      setLoading((prev) => ({ ...prev, applicants: false }));
    } catch (error) {
      showErrorToast(error, "Failed to load dashboard data");
      setLoading({ applicants: false, jobs: false, stats: false });
    }
  };

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      // In a real app, you would call: /api/dashboard/stats
      // For now, return mock data
      return {
        applications: user?.role === "tasker" ? 8 : 12,
        availableJobs: 24,
        balance: 1250000,
        interviews: 2,
        messages: 3,
        savedJobs: 5,
      };
    } catch (error) {
      showErrorToast(error, "Failed to load dashboard stats");
      // Return default values in case of error
      return {
        applications: 0,
        availableJobs: 0,
        balance: 0,
        interviews: 0,
        messages: 0,
        savedJobs: 0,
      };
    }
  };

  // Initial fetch
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await fetchDashboardData();
      } catch (error) {
        showErrorToast(error, "Failed to load dashboard");
      }
    };

    loadDashboardData();
  }, [user]);

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await fetchDashboardData();
    } catch (error) {
      showErrorToast(error, "Failed to refresh dashboard");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
      minimumFractionDigits: 0,
      style: "currency",
    }).format(amount);
  };

  // Status badge for applicants
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100" variant="secondary">
            Pending
          </Badge>
        );
      case "reviewed":
        return (
          <Badge className="border-blue-500 text-blue-500" variant="outline">
            Reviewed
          </Badge>
        );
      case "accepted":
        return <Badge className="bg-green-500 hover:bg-green-600">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "interviewed":
        return (
          <Badge className="border-purple-500 text-purple-500" variant="outline">
            Interviewed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return {
    applicants,
    fetchDashboardData,
    formatCurrency,
    getStatusBadge,
    handleRefresh,
    loading,
    recentJobs,
    stats,
    user,
  };
};
