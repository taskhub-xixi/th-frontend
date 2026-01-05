import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Bookmark } from "lucide-react";
import Link from "next/link";

export function SavedJobsEmpty() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No saved jobs yet</EmptyTitle>
        <EmptyDescription>
          Save interesting jobs to view them here later
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild size="sm">
          <Link href="/dashboard/jobs">Browse Jobs</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
