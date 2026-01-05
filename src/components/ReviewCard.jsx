import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon, CalendarIcon, MessageCircleIcon } from "lucide-react";

export default function ReviewCard({ review, onViewUser }) {
  const {
    id,
    job_id,
    reviewer_id,
    reviewee_id,
    rating,
    comment,
    created_at,
    reviewer_name,
    reviewee_name,
    job_title,
  } = review;

  // Calculate stars for display
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon className="size-4 fill-yellow-500 text-yellow-500" key={i} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon className="size-4 fill-yellow-500 text-yellow-500 opacity-50" key={i} />,
        );
      } else {
        stars.push(<StarIcon className="size-4 text-muted-foreground" key={i} />);
      }
    }
    return stars;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage alt={reviewer_name} src="" />
              <AvatarFallback>{reviewer_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{reviewer_name}</CardTitle>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">{renderStars()}</div>
                <span className="ml-2 text-sm font-medium">{rating?.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1 justify-end">
              <CalendarIcon className="size-4" />
              <span>{created_at ? new Date(created_at).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {job_title && (
          <div className="mb-3">
            <Badge className="text-xs" variant="secondary">
              {job_title}
            </Badge>
          </div>
        )}

        {comment && (
          <div className="flex items-start gap-2 mb-4">
            <MessageCircleIcon className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm">{comment}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button onClick={() => onViewUser?.(reviewee_id)} size="sm" variant="outline">
            View User Profile
          </Button>
          <div className="text-xs text-muted-foreground">For: {reviewee_name}</div>
        </div>
      </CardContent>
    </Card>
  );
}
