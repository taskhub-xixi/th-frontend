import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function MyJobsEmptyState() {
  return (
    <Card className="border-border bg-linear-to-b from-secondary/30 to-secondary/50">
      <CardContent className="py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <PlusCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          No jobs posted yet
        </h2>
        <p className="text-gray-500 mb-6">
          Create your first job listing to find great candidates
        </p>
        <Button asChild>
          <Link href="/dashboard/post-job">Post Your First Job</Link>
        </Button>
      </CardContent>
    </Card>
  );
}