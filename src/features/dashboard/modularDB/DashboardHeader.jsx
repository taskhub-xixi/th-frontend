import { Button } from "@/components/ui/button";
import { Sparkles, Settings } from "lucide-react";
import Link from "next/link";

const DashboardHeader = ({ user, handleRefresh }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Taskhub Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name || "User"}! Here's what's happening today.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={handleRefresh} size="sm" variant="outline">
          <Sparkles className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/dashboard/settings">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;