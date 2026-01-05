"use client";

import { useJobsPage } from "@/features/jobs/hooks/useJobsPage";
import JobSearchAndFilters from "@/features/jobs/components/JobSearchAndFilters";
import JobListings from "@/features/jobs/components/JobListings";
import { useRouter } from "next/navigation";

export default function JobsPageModular() {
  const {
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
    filterOptions
  } = useJobsPage();

  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Find Jobs
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Browse through available jobs and find the perfect match for your
          skills
        </p>
      </div>

      {/* Search and Filters */}
      <JobSearchAndFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        activeFilters={activeFilters}
        handleFilterSelect={handleFilterSelect}
        handleLocationInput={handleLocationInput}
        handleBudgetFilter={handleBudgetFilter}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        jobsCount={jobs.length}
        loading={loading}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={sortOptions}
      />

      {/* Job Listings */}
      <JobListings
        jobs={jobs}
        loading={loading}
        error={error}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        fetchJobs={fetchJobs}

        parseSkills={parseSkills}
        getJobAvatarUrl={getJobAvatarUrl}
        formatBudget={formatBudget}
        formatDate={formatDate}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={sortOptions}
        router={router}
      />
    </div>
  );
}
