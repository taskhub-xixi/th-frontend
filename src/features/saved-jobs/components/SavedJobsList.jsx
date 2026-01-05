import { SavedJobCard } from "./SavedJobsCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SavedJobsList({
  jobs,
  user,
  formatBudget,
  formatDate,
  getSkills,
  getCompanyAvatar,
  onRemove,
  onToggleSave,
}) {
  return (
    <>
      <div className="space-y-4">
        {jobs.map((job) => (
          <SavedJobCard
            key={job.id}
            job={job}
            user={user}
            formatBudget={formatBudget}
            formatDate={formatDate}
            getSkills={getSkills}
            getCompanyAvatar={getCompanyAvatar}
            onRemove={onRemove}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>

      {/* Bottom Action */}
      {jobs.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            asChild
            size="sm"
            className="text-xs md:text-sm"
          >
            <Link href="/dashboard/jobs">Browse More Jobs</Link>
          </Button>
        </div>
      )}
    </>
  );
}
