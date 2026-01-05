import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSignIcon, CalendarIcon, UserIcon, MailIcon, PhoneIcon } from "lucide-react";

export default function ApplicationCard({ application, onAccept, onReject, onViewProfile }) {
  const {
    id,
    job_id,
    tasker_id,
    proposal,
    proposed_budget,
    status,
    created_at,
    tasker_name,
    tasker_email,
    tasker_phone,
    tasker_avg_rating,
    tasker_total_reviews,
  } = application;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage alt={tasker_name} src="" />
              <AvatarFallback>{tasker_name?.charAt(0) || "T"}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{tasker_name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>{tasker_avg_rating?.toFixed(1)} ★</span>
                <span>({tasker_total_reviews} reviews)</span>
              </div>
            </div>
          </div>
          <Badge
            variant={
              status === "pending" ? "secondary" : status === "accepted" ? "default" : "destructive"
            }
          >
            {status?.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MailIcon className="size-4 text-muted-foreground" />
            <span>{tasker_email}</span>
          </div>
          {tasker_phone && (
            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon className="size-4 text-muted-foreground" />
              <span>{tasker_phone}</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Proposal</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">{proposal}</p>
        </div>

        {proposed_budget && (
          <div className="flex items-center gap-2 text-sm mb-4">
            <DollarSignIcon className="size-4 text-green-600" />
            <span className="font-medium">Proposed Budget: ${proposed_budget?.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="size-4" />
          <span>Applied: {created_at ? new Date(created_at).toLocaleDateString() : "N/A"}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => onViewProfile?.(tasker_id)}
          size="sm"
          variant="outline"
        >
          View Profile
        </Button>
        {status === "pending" && (
          <>
            <Button onClick={() => onReject?.(id)} size="sm" variant="destructive">
              Reject
            </Button>
            <Button onClick={() => onAccept?.(id)} size="sm">
              Accept
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
