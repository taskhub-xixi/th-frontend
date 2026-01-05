import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Bell, Zap, Briefcase } from "lucide-react";
import Link from "next/link";
import { useResponsive } from "@/hooks/responsive-context";

const QuickActions = ({ user }) => {
  const { isMobile } = useResponsive();

  return (
    <section>
      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
      <div
        className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-2 md:grid-cols-4 gap-4"}
      >
        <Button
          asChild
          className="h-auto py-6 flex flex-col items-center justify-center gap-2"
          variant="outline"
        >
          <Link href="/dashboard/jobs">
            <Search className="h-6 w-6" />
            <span>Search Jobs</span>
          </Link>
        </Button>

        <Button
          asChild
          className="h-auto py-6 flex flex-col items-center justify-center gap-2"
          variant="outline"
        >
          <Link href="/dashboard/messages">
            <MessageSquare className="h-6 w-6" />
            <span>Messages</span>
          </Link>
        </Button>

        <Button
          asChild
          className="h-auto py-6 flex flex-col items-center justify-center gap-2"
          variant="outline"
        >
          <Link href="/dashboard/notifications">
            <Bell className="h-6 w-6" />
            <span>Notifications</span>
          </Link>
        </Button>

        {user?.role === "poster" ? (
          <Button
            asChild
            className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80"
          >
            <Link href="/dashboard/post-job">
              <Zap className="h-6 w-6" />
              <span>Post a Job</span>
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80"
          >
            <Link href="/dashboard/jobs">
              <Briefcase className="h-6 w-6" />
              <span>Apply Now</span>
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
};

export default QuickActions;