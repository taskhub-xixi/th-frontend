import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, MapPinIcon, DollarSignIcon, UserIcon } from "lucide-react";

export default function JobCard({ job, onApply, onViewDetails }) {
  const {
    id,
    title,
    description,
    budget,
    location,
    deadline,
    category,
    poster,
    status,
    created_at,
    applications_count = 0,
  } = job;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-2">{title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <UserIcon className="size-4" />
              <span className="truncate">{poster?.name || "Anonymous"}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <DollarSignIcon className="size-4 text-green-600" />
              <span className="font-semibold text-lg">{budget?.toLocaleString()}</span>
            </div>
            <Badge
              variant={
                status === "open" ? "default" : status === "in_progress" ? "secondary" : "outline"
              }
            >
              {status?.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPinIcon className="size-4" />
            <span>{location || "Remote"}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-4" />
            <span>
              {deadline
                ? new Date(deadline).toLocaleDateString()
                : created_at
                  ? new Date(created_at).toLocaleDateString()
                  : "N/A"}
            </span>
          </div>
          {category && (
            <div className="flex items-center gap-1">
              <span className="font-medium">{category}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-3">
        <Button className="flex-1" onClick={() => onViewDetails?.(id)} size="sm" variant="outline">
          View Details
        </Button>
        {status === "open" && (
          <Button onClick={() => onApply?.(id)} size="sm">
            Apply Now
          </Button>
        )}
        {applications_count > 0 && (
          <Badge className="ml-auto" variant="secondary">
            {applications_count} {applications_count === 1 ? "application" : "applications"}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
