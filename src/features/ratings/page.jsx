// src/features/ratings/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, User } from "lucide-react";
import { ratingsApi } from "@/lib/api/ratings";
import ReviewCard from "@/features/ratings/components/ReviewCard";
import UserRatingDisplay from "@/features/ratings/components/UserRatingDisplay";
import { useAuth } from "@/context/AuthContext";

const RatingsPage = () => {
  const { id: userIdParam } = useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [reviewsReceived, setReviewsReceived] = useState([]);
  const [reviewsGiven, setReviewsGiven] = useState([]);
  const [ratingInfo, setRatingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const targetUserId = userIdParam
    ? Array.isArray(userIdParam)
      ? userIdParam[0]
      : userIdParam
    : user?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchUserData();
    }
  }, [targetUserId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's rating info
      const ratingResponse = await ratingsApi.getUserRating(targetUserId);
      if (ratingResponse.success) {
        setRatingInfo(ratingResponse.ratingInfo);
      }

      // Get reviews received by the user
      const receivedResponse = await ratingsApi.getUserReviews(targetUserId);
      if (receivedResponse.success) {
        setReviewsReceived(receivedResponse.reviews);
      }

      // Get reviews given by the user
      if (user && user.id === Number.parseInt(targetUserId)) {
        const givenResponse = await ratingsApi.getMyReviews();
        if (givenResponse.success) {
          setReviewsGiven(givenResponse.reviews);
        }
      }

      // Get user data for display
      // In a real app, you would fetch user details here
      setUserData({ id: targetUserId });
    } catch (err) {
      setError(err.message || "Failed to load user ratings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div className="h-24 bg-gray-200 rounded" key={i} />
            ))}
          </div>
          <div className="h-10 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <MessageCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Ratings</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button className="text-blue-600 hover:underline" onClick={fetchUserData}>
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Ratings & Reviews</h1>
        <p className="text-gray-600 mt-2">View ratings and reviews for this user</p>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold">{ratingInfo?.avg_rating?.toFixed(1) || "0.0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold">{ratingInfo?.total_reviews || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-lg font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Tabs */}
      <Tabs className="w-full" defaultValue="received">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">Reviews Received</TabsTrigger>
          <TabsTrigger value="given">Reviews Given</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          <div className="space-y-4">
            {reviewsReceived.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">This user hasn't received any reviews yet.</p>
                </CardContent>
              </Card>
            ) : (
              reviewsReceived.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
          </div>
        </TabsContent>
        <TabsContent value="given">
          <div className="space-y-4">
            {reviewsGiven.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Reviews Given</h3>
                  <p className="text-gray-600">This user hasn't given any reviews yet.</p>
                </CardContent>
              </Card>
            ) : (
              reviewsGiven.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RatingsPage;
