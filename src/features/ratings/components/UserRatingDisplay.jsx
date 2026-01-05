import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const UserRatingDisplay = ({ ratingInfo, title = "Rating" }) => {
  if (!ratingInfo) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-gray-500">No rating information available</p>
        </CardContent>
      </Card>
    );
  }

  const { avg_rating, total_reviews } = ratingInfo;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    className={`h-5 w-5 ${i < Math.floor(avg_rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    key={i}
                  />
                ))}
              </div>
              <span className="ml-2 text-lg font-bold">{avg_rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {total_reviews} {total_reviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRatingDisplay;
