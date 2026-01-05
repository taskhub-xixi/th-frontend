import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, MapPin, X } from "lucide-react";
import Link from "next/link";

export function SavedJobCard({
  job,
  user,
  formatBudget,
  formatDate,
  getSkills,
  getCompanyAvatar,
  onRemove,
  onToggleSave,
}) {
  const skills = getSkills(job);

  const getJobAvatarUrl = (jobData) => {
    if (!jobData) return getCompanyAvatar({ name: "Job" });
    const seed = jobData.title || jobData.poster_name || `Job ${jobData.id}`;
    return getCompanyAvatar({ name: seed });
  };

  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardContent className="p-4 md:p-6">
        {/* Header Row: Avatar + Title + Budget + Actions */}
        <div className="flex gap-4 mb-4">
          {/* Avatar */}
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex-shrink-0 flex items-center justify-center">
            <img
              src={getJobAvatarUrl(job)}
              alt={`${job.title} avatar`}
              className="w-full h-full rounded-lg object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent((job.title || 'Job').substring(0, 2))}&background=0ea5e9&color=fff&size=64`;
              }}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              {/* Title & Description */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base md:text-lg text-foreground line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mt-1">
                  {job.description?.substring(0, 100) || "No description"}...
                </p>
              </div>

              {/* Budget & Action Buttons */}
              <div className="flex items-start gap-2 flex-shrink-0">
                {/* Budget */}
                <div className="text-right">
                  <p className="font-bold text-lg md:text-xl text-foreground whitespace-nowrap">
                    {formatBudget(job.budget)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-blue-50"
                    onClick={() => onToggleSave(job.id)}
                    title="Remove from saved"
                  >
                    <Bookmark className="h-4 w-4 fill-blue-500 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50"
                    onClick={() => onRemove(job.id)}
                    title="Remove"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meta Info Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 pb-4 mb-4 border-b border-border">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            {job.location || "Remote"}
          </span>

          {job.work_type && (
            <>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="whitespace-nowrap">{job.work_type}</span>
            </>
          )}

          {job.commitment && (
            <>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="whitespace-nowrap">{job.commitment}</span>
            </>
          )}

          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="whitespace-nowrap">Posted: {formatDate(job.created_at)}</span>
        </div>

        {/* Skills Row */}
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {skills.slice(0, 3).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="font-normal text-xs"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge
                variant="secondary"
                className="font-normal text-xs"
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
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 sm:flex-none text-xs md:text-sm"
          >
            <Link href={`/dashboard/jobs/${job.id}`}>View Details</Link>
          </Button>

          {user?.role === "tasker" && (
            <Button
              size="sm"
              asChild
              className="flex-1 sm:flex-none text-xs md:text-sm"
            >
              <Link href={`/dashboard/jobs/${job.id}/apply`}>
                Apply Now
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
