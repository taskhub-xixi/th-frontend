import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Calendar, Clock, MapPin, DollarSign } from "lucide-react";

export default function JobListings({
  jobs,
  loading,
  error,
  hasActiveFilters,
  clearFilters,
  fetchJobs,
  renderSkeleton,
  parseSkills,
  getJobAvatarUrl,
  formatBudget,
  formatDate,
  sortBy,
  setSortBy,
  sortOptions,
  router
}) {
  return (
    <section>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">
          Available Jobs
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm text-gray-500 hidden sm:inline">
            Sort by:
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs md:text-sm"
              >
                {sortBy.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={`${option.value}-${option.order}`}
                  onClick={() => setSortBy(option)}
                  className={
                    sortBy.value === option.value && sortBy.order === option.order
                      ? "bg-accent"
                      : ""
                  }
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">

        </div>
      ) : error ? (
        <Card className="border-border">
          <CardContent className="p-6 md:p-8 text-center">
            <p className="text-red-500 mb-4 text-sm md:text-base">{error}</p>
            <Button onClick={fetchJobs} size="sm">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : jobs.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-6 md:p-8 text-center">
            <div className="space-y-3">
              <p className="text-gray-500 text-sm md:text-base">
                No jobs found matching your criteria.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="text-xs md:text-sm"
                >
                  Clear all filters and try again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const skills = parseSkills(job);

            return (
              <Card
                key={job.id}
                className="border-border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <img
                        src={getJobAvatarUrl(job)}
                        alt={`${job.title} avatar`}
                        className="w-full h-full rounded-lg object-cover"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent((job.title || 'Job').substring(0, 2))}&background=0ea5e9&color=fff&size=64`;
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-4">
                        {/* Title & Description */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base md:text-lg text-foreground line-clamp-2">
                            {job.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2">
                            {job.description?.substring(0, 100) ||
                              "No description available"}
                            ...
                          </p>
                        </div>

                        {/* Budget */}
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-lg md:text-xl text-foreground whitespace-nowrap">
                            {formatBudget(job.budget)}
                          </p>
                          {job.payment_type && (
                            <span className="text-xs text-gray-500">
                              {job.payment_type.replace("_", " ")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 pb-4 mb-4 border-b border-border">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {job.location || "Remote"}
                        </span>

                        {job.work_type && (
                          <>
                            <span className="hidden sm:inline text-gray-300">
                              •
                            </span>
                            <span className="whitespace-nowrap">
                              {job.work_type}
                            </span>
                          </>
                        )}

                        {job.commitment && (
                          <>
                            <span className="hidden sm:inline text-gray-300">
                              •
                            </span>
                            <span className="whitespace-nowrap">
                              {job.commitment}
                            </span>
                          </>
                        )}

                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          {formatDate(job.created_at)}
                        </span>

                        {job.deadline && (
                          <>
                            <span className="hidden sm:inline text-gray-300">
                              •
                            </span>
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              Due: {formatDate(job.deadline)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Skills & Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Skills */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {skills.slice(0, 3).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="font-normal text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {skills.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="font-normal text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              +{skills.length - 3}
                            </Badge>
                          )}
                          {skills.length === 0 && (
                            <span className="text-xs text-gray-400">
                              No skills specified
                            </span>
                          )}
                        </div>

                        {/* Button */}
                        <Button
                          size="sm"
                          className="w-full sm:w-auto text-xs md:text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/jobs/${job.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
