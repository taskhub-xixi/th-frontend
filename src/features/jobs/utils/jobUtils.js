/**
 * Utility functions for jobs feature
 */

/**
 * Format job status to display-friendly text
 */
export function formatJobStatus(status) {
  const statusMap = {
    open: "Open",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    pending: "Pending",
  };

  return statusMap[status] || status;
}

/**
 * Get color class for job status badge
 */
export function getJobStatusColor(status) {
  const colorMap = {
    open: "bg-green-100 text-green-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return colorMap[status] || "bg-gray-100 text-gray-800";
}

/**
 * Format job type to display-friendly text
 */
export function formatJobType(type) {
  const typeMap = {
    one_time: "One-time",
    ongoing: "Ongoing",
    milestone: "Milestone-based",
  };

  return typeMap[type] || type;
}

/**
 * Calculate days ago for job posting
 */
export function getDaysAgo(dateString) {
  if (!dateString) return "Just now";

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Check if user is the job poster
 */
export function isJobPoster(job, userId) {
  return job?.poster_id === userId;
}

/**
 * Check if user can apply to job
 */
export function canApplyToJob(job, user) {
  if (!user) return false;
  if (job.status !== "open") return false;
  if (job.poster_id === user.id) return false;
  return true;
}

/**
 * Format budget to currency display
 */
export function formatBudget(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount) || 0);
}

/**
 * Parse job filters from URL or state
 */
export function parseJobFilters(filters) {
  const parsedFilters = {};

  if (filters.search) {
    parsedFilters.search = filters.search;
  }

  if (filters.category) {
    parsedFilters.category_id = filters.category;
  }

  if (filters.location) {
    parsedFilters.location = filters.location;
  }

  if (filters.type) {
    parsedFilters.job_type = filters.type;
  }

  if (filters.budgetMin) {
    parsedFilters.budget_min = filters.budgetMin;
  }

  if (filters.budgetMax) {
    parsedFilters.budget_max = filters.budgetMax;
  }

  return parsedFilters;
}
