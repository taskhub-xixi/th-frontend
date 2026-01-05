import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { useState } from "react";

export function WriteReviewDialog({
  open,
  onOpenChange,
  companyName,
  onSubmit,
  reviewType = "job", // 'job' or 'user'
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [position, setPosition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    if (!review.trim()) {
      toast({
        title: "Review required",
        description: "Please write a review before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        rating,
        title: title.trim(),
        content: review.trim(),
        position: position.trim() || undefined,
      };

      // Call parent onSubmit function
      await onSubmit(reviewData);

      // Reset form
      setRating(0);
      setTitle("");
      setReview("");
      setPosition("");
    } catch (error) {
      // Error is already handled by parent component
      // Keep dialog open for retry
      return;
    } finally {
      setIsSubmitting(false);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setRating(0);
    setTitle("");
    setReview("");
    setPosition("");
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience{" "}
            {reviewType === "job"
              ? "working on this job"
              : "working with this user"}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="rating">
              Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  type="button"
                  aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  {rating} star{rating !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Your Position (Optional)</Label>
            <Input
              id="position"
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g., Software Engineer, Project Manager"
              value={position}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Review Title (Optional)</Label>
            <Input
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              value={title}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">
              Your Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              className="min-h-[120px]"
              id="review"
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this experience..."
              required
              value={review}
              maxLength={1000}
            />
            <div className="flex justify-between">
              <p className="text-xs text-muted-foreground">
                Share details about your experience
              </p>
              <p className="text-xs text-muted-foreground">
                {review.length}/1000 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleCancel}
              type="button"
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting || rating === 0 || !review.trim()}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
