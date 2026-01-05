import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { jobsApi } from "@/lib/api/jobs";
import { showErrorToast } from "@/lib/errorHandler";
import { getCompanyAvatar } from "@/lib/dicebearAvatar";

// Filter options yang sesuai dengan DATA YANG ADA di database
const filterOptions = {
  category: [
    { value: "", label: "All Categories" },
    { value: "1", label: "Other" },
    { value: "2", label: "Business" },
    { value: "3", label: "Sales" },
    { value: "4", label: "Customer Support" },
    { value: "5", label: "Writing" },
    { value: "6", label: "Marketing" },
    { value: "7", label: "Product" },
    { value: "8", label: "Design" },
    { value: "9", label: "Engineering" },
  ],
  work_type: [
    { value: "", label: "All Work Types" },
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
  ],
  commitment: [
    { value: "", label: "All Commitments" },
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
  ],
  payment_type: [
    { value: "", label: "All Payment Types" },
    { value: "fixed", label: "Fixed Price" },
    { value: "hourly", label: "Hourly Rate" },
    { value: "project", label: "Project-based" },
    { value: "milestone", label: "Milestone-based" },
  ],
};

export function useJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    category: "",
    work_type: "",
    commitment: "",
    payment_type: "",
    location: "",
    minBudget: "",
    maxBudget: "",
  });
  const [sortBy, setSortBy] = useState({
    value: "created_at",
    label: "Newest",
    order: "desc",
  });

  // Sort options
  const sortOptions = [
    { value: "created_at", label: "Newest", order: "desc" },
    { value: "created_at", label: "Oldest", order: "asc" },
    { value: "budget", label: "Budget (High to Low)", order: "desc" },
    { value: "budget", label: "Budget (Low to High)", order: "asc" },
  ];

  // Debounce untuk search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch jobs dari API
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Siapkan filter untuk API
      const apiFilters = {
        limit: 50,
        page: 1,
        sortBy: sortBy.value,
        sortOrder: sortBy.order,
      };

      // Tambahkan search filter
      if (searchQuery) {
        apiFilters.search = searchQuery;
      }

      // Tambahkan semua active filters yang tidak kosong
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value && value !== "") {
          apiFilters[key] = value;
        }
      });

      console.log("Fetching with filters:", apiFilters); // Debug log

      // Panggil API
      const response = await jobsApi.getJobs(apiFilters);
      console.log("API Response:", response); // Debug log

      setJobs(response.jobs || []);
    } catch (err) {
      const errorInfo = showErrorToast(err, "An error occurred while fetching jobs");
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeFilters, sortBy]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterSelect = (filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleLocationInput = (value) => {
    setActiveFilters((prev) => ({
      ...prev,
      location: value,
    }));
  };

  const handleBudgetFilter = (type, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value ? Number.parseFloat(value) : "",
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      category: "",
      work_type: "",
      commitment: "",
      payment_type: "",
      location: "",
      minBudget: "",
      maxBudget: "",
    });
    setSearchInput("");
  };

  const hasActiveFilters = useMemo(
    () =>
      Object.entries(activeFilters).some(([key, value]) => {
        if (key === "minBudget" || key === "maxBudget") {
          return value !== "";
        }
        return value !== "" && value !== null;
      }) || searchInput,
    [activeFilters, searchInput]
  );

  // Helper untuk mendapatkan avatar DiceBear dari job
  const getJobAvatarUrl = (job) => {
    if (!job) return getCompanyAvatar({ name: "Job" });

    // Use job title or poster name for the avatar
    const seed = job.title || job.poster_name || `Job ${job.id}`;
    return getCompanyAvatar({ name: seed });
  };

  // Helper untuk format budget
  const formatBudget = (budget) => {
    if (!budget) return "Negotiable";
    if (budget >= 1000) {
      return `$${(budget / 1000).toFixed(1)}`;
    }
    return `$${budget.toLocaleString()}`;
  };

  // Helper untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Parse skills dari job
  const parseSkills = (job) => {
    if (!job.skills) return [];

    if (Array.isArray(job.skills)) {
      return job.skills;
    }

    if (typeof job.skills === "string") {
      return job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }

    return [];
  };

  // Skeleton loader
  const renderSkeleton = () => (
    <Card className="border-border">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return {
    jobs,
    loading,
    error,
    searchInput,
    setSearchInput,
    activeFilters,
    handleFilterSelect,
    handleLocationInput,
    handleBudgetFilter,
    clearFilters,
    hasActiveFilters,
    sortBy,
    setSortBy,
    sortOptions,
    fetchJobs,
    getJobAvatarUrl,
    formatBudget,
    formatDate,
    parseSkills,
    renderSkeleton,
    filterOptions
  };
}