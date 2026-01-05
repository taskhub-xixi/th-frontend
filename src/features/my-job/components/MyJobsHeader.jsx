import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyJobsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Jobs</h1>
        <p className="text-gray-600">Manage your job postings</p>
      </div>
      <Button asChild>
        <Link href="/dashboard/post-job">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Post New Job
        </Link>
      </Button>
    </div>
  );
}