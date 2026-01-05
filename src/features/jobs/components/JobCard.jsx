import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const JobCard = ({ job }) => {
  const router = useRouter();
  const { user } = useAuth();

  const handleViewDetails = () => {
    router.push(`/dashboard/jobs/${job.id}`);
  };

  const handleApply = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "tasker") {
      alert("Only taskers can apply to jobs");
      return;
    }

    router.push(`/jobs/${job.id}/apply`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
          <Badge
            variant={
              job.status === "open"
                ? "default"
                : job.status === "in_progress"
                  ? "secondary"
                  : "outline"
            }
          >
            {job.status.replace("_", " ")}
          </Badge>
        </div>
        {job.poster_name && (
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <User className="h-4 w-4 mr-1" />
            <span>by {job.poster_name}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {job.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{job.location || "Remote"}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Clock className="h-4 w-4 mr-1" />
          <span>
            Due: {job.deadline ? formatDate(job.deadline) : "Not specified"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <div className="text-lg font-bold text-blue-600">
          $
          {Number(job.budget).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleViewDetails} size="sm" variant="outline">
            View Details
          </Button>

          {user?.role === "tasker" && job.status === "open" && (
            <Button onClick={handleApply} size="sm">
              Apply Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
