"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { ratingsApi } from "@/lib/api/ratings";
import { Loader2, Star, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { WriteReviewDialog } from "./WriteReviewDialog";

export function ReviewSelection({ jobId, companyName, userId, revieweeId }) {
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [helpfulLoading, setHelpfulLoading] = useState(null);
  const { user } = useAuth();

  // Determine review type based on provided ID
  const reviewType = jobId ? "job" : userId ? "user" : null;

  // Helper function to extract error message from API response
  const extractErrorMessage = (error) => {
    console.log("Full error object:", error);

    // Check if error has response data
    if (error?.response?.data) {
      const { data } = error.response;

      // If backend returns a message field
      if (data.message) {
        return data.message;
      }

      // If backend returns an error field
      if (data.error) {
        return data.error;
      }

      // If data is a string
      if (typeof data === "string") {
        return data;
      }
    }

    // Check for axios error message
    if (error?.message) {
      return error.message;
    }

    // Generic error message
    return "An unexpected error occurred";
  };

  // Fetch reviews based on provided ID
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        let data = [];

        if (jobId) {
          // Fetch reviews for a job
          const response = await ratingsApi.getJobReviews(jobId);
          console.log("Job reviews response:", response);

          if (response.success) {
            data = response.data || response.reviews || [];
          } else {
            // Handle backend error response
            const errorMsg = response.message || "Failed to fetch job reviews";
            throw new Error(errorMsg);
          }
        } else if (userId) {
          // Fetch reviews for a user
          const response = await ratingsApi.getUserReviews(userId);
          console.log("User reviews response:", response);

          if (response.success) {
            data = response.data || response.reviews || [];
          } else {
            // Handle backend error response
            const errorMsg = response.message || "Failed to fetch user reviews";
            throw new Error(errorMsg);
          }
        } else {
          // Default to empty if no ID provided
          data = [];
        }

        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);

        const errorMessage = extractErrorMessage(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (reviewType) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [jobId, userId, reviewType, toast]);

  // Handle marking review as helpful with error handling
  const handleMarkHelpful = async (reviewId, currentHelpfulCount) => {
    if (!user) {
      toast.error("Login required", {
        description: "Please login to mark reviews as helpful",
      });
      return;
    }

    try {
      setHelpfulLoading(reviewId);

      // Check if API has mark helpful endpoint
      const hasHelpfulApi = false; // Set to true if API has endpoint

      if (hasHelpfulApi) {
        try {
          // Call API to mark as helpful
          const response = await ratingsApi.markReviewHelpful(reviewId);

          if (!response.success) {
            throw new Error(response.message || "Failed to mark review as helpful");
          }
        } catch (apiError) {
          const errorMessage = extractErrorMessage(apiError);
          throw new Error(errorMessage);
        }
      }

      // Update local state
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                helpful_count: (currentHelpfulCount || 0) + 1,
                is_helpful: true,
              }
            : review,
        ),
      );

      toast.success("Marked as helpful", {
        description: "Thank you for your feedback!",
      });
    } catch (err) {
      console.error("Error marking review as helpful:", err);

      const errorMessage = extractErrorMessage(err);

      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setHelpfulLoading(null);
    }
  };

  // Handle submitting a new review with better error handling
  const handleSubmitReview = async (reviewData) => {
    try {
      let response;

      // If we have a jobId, submit review for job
      if (jobId && revieweeId) {
        response = await ratingsApi.createReview({
          ...reviewData,
          job_id: jobId,
          reviewee_id: revieweeId,
          type: "job",
        });
      } else if (userId) {
        // Submit review for user
        response = await ratingsApi.createReview({
          ...reviewData,
          reviewee_id: userId || revieweeId,
          type: "user",
        });
      } else {
        throw new Error("No valid reviewee ID provided");
      }

      console.log("Submit review response:", response);

      if (!response.success) {
        // Extract error message from backend
        const errorMessage = response.message || "Failed to submit review";
        throw new Error(errorMessage);
      }

      // Refresh reviews
      try {
        if (jobId) {
          const refreshResponse = await ratingsApi.getJobReviews(jobId);

          if (refreshResponse.success) {
            setReviews(refreshResponse.data || refreshResponse.reviews || []);
          } else {
            throw new Error(refreshResponse.message || "Failed to refresh reviews");
          }
        } else if (userId) {
          const refreshResponse = await ratingsApi.getUserReviews(userId);

          if (refreshResponse.success) {
            setReviews(refreshResponse.data || refreshResponse.reviews || []);
          } else {
            throw new Error(refreshResponse.message || "Failed to refresh reviews");
          }
        }
      } catch (refreshError) {
        console.error("Error refreshing reviews:", refreshError);
        // Don't throw refresh error, just log it
      }

      toast("Review submitted!", {
        description: "Thank you for your review.",
      });

      return response;
    } catch (err) {
      console.error("Error submitting review:", err);

      const errorMessage = extractErrorMessage(err);

      toast("Submission Failed", {
        description: errorMessage,
      });

      // Re-throw error so dialog can stay open for retry
      throw err;
    }
  };

  // Calculate statistics
  const calculateStatistics = () => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [
          { count: 0, percentage: 0, stars: 5 },
          { count: 0, percentage: 0, stars: 4 },
          { count: 0, percentage: 0, stars: 3 },
          { count: 0, percentage: 0, stars: 2 },
          { count: 0, percentage: 0, stars: 1 },
        ],
      };
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => {
      return sum + (review.rating || 0);
    }, 0);
    const averageRating = totalRating / reviews.length;

    // Calculate rating distribution
    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((review) => Math.round(review.rating || 0) === stars).length;
      const percentage = (count / reviews.length) * 100;
      return { count, percentage, stars };
    });

    return {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      ratingDistribution: distribution,
    };
  };

  const { averageRating, totalReviews, ratingDistribution } = calculateStatistics();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
      return "Recently";
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get reviewer name with fallback
  const getReviewerName = (review) => {
    return review.reviewer_name || review.reviewer?.name || review.user?.name || "Anonymous";
  };

  // Get reviewer position with fallback
  const getReviewerPosition = (review) => {
    return review.position || review.reviewer?.position || review.user?.position || "";
  };

  // Function to retry fetching reviews
  const handleRetry = () => {
    setError(null);
    // Trigger useEffect to refetch
    if (reviewType) {
      setLoading(true);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading reviews...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <Star className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-medium text-lg text-red-600">Unable to Load Reviews</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>

          <div className="space-y-2 pt-4">
            <p className="text-sm text-gray-500">Possible reasons:</p>
            <ul className="text-sm text-gray-500 text-left max-w-md mx-auto">
              <li>• You don't have permission to view these reviews</li>
              <li>• The job or user doesn't exist</li>
              <li>• There was a network error</li>
            </ul>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="default" onClick={handleRetry} className="gap-2">
              <Loader2 className="h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No review type specified
  if (!reviewType) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Star className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-lg mb-2">No Review Context</h3>
          <p className="text-muted-foreground mb-4">
            Please specify a job or user to view reviews.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">
              {reviews.length > 0 ? `Reviews (${totalReviews})` : "Reviews"}
            </CardTitle>
            {user && reviews.length > 0 && (
              <Button onClick={() => setWriteReviewOpen(true)} variant="outline" size="sm">
                Write a Review
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.length > 0 ? (
            <>
              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground mb-2">{averageRating}</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          className={`h-5 w-5 ${
                            star <= Math.round(averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                          key={star}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {totalReviews} review
                      {totalReviews !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {ratingDistribution.map((dist) => (
                    <div className="flex items-center gap-3" key={dist.stars}>
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm text-muted-foreground">{dist.stars}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Progress className="flex-1 h-2" value={dist.percentage} />
                      <span className="text-sm text-muted-foreground w-8">{dist.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 pt-4 border-t border-border">
                {reviews.map((review) => (
                  <div
                    className="space-y-3 pb-4 border-b border-border last:border-b-0"
                    key={review.id || review._id}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(getReviewerName(review))}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                          <div>
                            <p className="font-medium text-foreground">{getReviewerName(review)}</p>
                            {getReviewerPosition(review) && (
                              <p className="text-sm text-muted-foreground">
                                {getReviewerPosition(review)}
                              </p>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground mt-1 sm:mt-0">
                            {formatDate(review.created_at || review.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              className={`h-4 w-4 ${
                                star <= (review.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                              key={star}
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">
                            {review.rating || 0}.0
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
                        )}
                        <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                          {review.content || review.review || "No review content"}
                        </p>
                        <Button
                          className="gap-2"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkHelpful(review.id, review.helpful_count || 0)}
                          disabled={helpfulLoading === review.id || review.is_helpful}
                        >
                          {helpfulLoading === review.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <ThumbsUp className="h-3 w-3" />
                          )}
                          Helpful ({review.helpful_count || 0})
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to share your experience!</p>
              {user && (
                <Button onClick={() => setWriteReviewOpen(true)} variant="outline" size="sm">
                  Write First Review
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Write Review Dialog */}
      {user && (
        <WriteReviewDialog
          companyName={companyName || "this company"}
          onOpenChange={setWriteReviewOpen}
          open={writeReviewOpen}
          onSubmit={handleSubmitReview}
          reviewType={reviewType}
        />
      )}
    </>
  );
}
