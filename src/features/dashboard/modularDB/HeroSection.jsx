import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, MessageSquare, Award, ChevronRight, Users } from "lucide-react";
import Link from "next/link";

const HeroSection = ({ stats, user }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main intro */}
      <Card className="flex-1 border-border">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Taskhub</h1>
          <h2 className="text-lg font-semibold text-foreground mb-3">Start your job search</h2>
          <p className="text-muted-foreground text-sm mb-6">
            We stay true to our word. Your next role is here! Don't hold the ball - get it
            rolling.
          </p>

          <div className="flex flex-wrap gap-3">
            <Badge className="gap-1.5" variant="outline">
              <TrendingUp className="h-3.5 w-3.5" />
              {stats.applications} {user?.role === "poster" ? "Applications" : "Applied Jobs"}
            </Badge>
            <Badge className="gap-1.5" variant="outline">
              <MessageSquare className="h-3.5 w-3.5" />
              {stats.messages} Unread Messages
            </Badge>
            {stats.interviews > 0 && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 gap-1.5">
                <Award className="h-3.5 w-3.5" />
                {stats.interviews} Upcoming Interviews
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info cards */}
      <Card className="w-full lg:w-56 border-border">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground mb-2">Search for Jobs</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We vet companies job vacancies before listing them. They are actually looking for you!
          </p>
          <Button asChild className="w-full" size="sm" variant="outline">
            <Link href="/dashboard/jobs">
              See Jobs
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full lg:w-56 border-border">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Job Applicants</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Review and manage applicants who have applied to your job postings.
          </p>
          <Button asChild className="w-full" size="sm" variant="outline">
            <Link href="/dashboard/my-jobs">
              See Applicants
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroSection;