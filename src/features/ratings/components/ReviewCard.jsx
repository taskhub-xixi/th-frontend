import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage alt={review.reviewer_name} src={review.reviewer_avatar} />
              <AvatarFallback>{review.reviewer_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{review.reviewer_name}</h3>
              <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                key={i}
              />
            ))}
            <span className="ml-1 text-sm font-medium">{review.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {review.comment && (
          <div className="mb-3">
            <p className="text-gray-700">{review.comment}</p>
          </div>
        )}
        {review.job_title && (
          <div className="text-xs text-gray-500">For job: {review.job_title}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
