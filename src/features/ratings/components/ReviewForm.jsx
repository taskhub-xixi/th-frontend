import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { ratingsApi } from "@/lib/api/ratings";
import { useAuth } from "@/context/AuthContext";

const ReviewForm = ({ job, reviewee, onSuccess, revieweeId }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle flexible reviewee ID (from application or direct prop)
  const actualRevieweeId = revieweeId || reviewee?.tasker_id || reviewee?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const reviewData = {
        comment: comment.trim() || null,
        job_id: job.id,
        rating,
        reviewee_id: actualRevieweeId,
      };

      const response = await ratingsApi.createReview(reviewData);
      if (response.success) {
        if (onSuccess) {
          onSuccess(response.review);
        }
      } else {
        setError(response.message || "Failed to submit review");
      }
    } catch (err) {
      setError(err.message || "An error occurred while submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
        <CardDescription>
          Rate your experience for the job "{job.title}"
          {reviewee && ` with ${reviewee.tasker_name || reviewee.name}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  className={`p-1 ${star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"}`}
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  type="button"
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""} rating` : "Select a rating"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block" htmlFor="comment">
              Comment (Optional)
            </label>
            <Textarea
              id="comment"
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this user..."
              rows={4}
              value={comment}
            />
          </div>

          <Button disabled={loading || rating === 0} type="submit">
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
