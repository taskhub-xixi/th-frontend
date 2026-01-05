export const formatBudget = (budget) => {
  if (!budget) return "N/A";
  return budget >= 1000
    ? `$${(budget / 1000).toFixed(0)}k`
    : `$${budget.toLocaleString()}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getInitials = (title) =>
  title?.charAt(0).toUpperCase() || "J";

export const getSkills = (job) => {
  if (typeof job.skills === "string") {
    return job.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(job.skills)) return job.skills;
  return [];
};
