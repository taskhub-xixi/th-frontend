import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyJobsErrorState({ error, onRetry, userRole }) {
  return (
    <Card className="border-border">
      <CardContent className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={onRetry} variant="outline">Retry</Button>
          {error.includes("poster") && (
            <Button asChild>
              <Link href="/dashboard/profile">Change Role</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}