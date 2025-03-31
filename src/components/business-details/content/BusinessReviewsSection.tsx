
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  created_at: string;
  business_id: string;
  profile_id: string;
  rating: number;
  comment: string;
  profile: {
    id: string;
    username: string;
    avatar_url: string | null;
    full_name: string;
  };
}

interface BusinessReviewsSectionProps {
  businessId: string;
}

export const BusinessReviewsSection = ({ businessId }: BusinessReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { data, error, isLoading } = useQuery({
    queryKey: ['business-reviews', businessId],
    queryFn: async () => {
      // Modified this query to use business_comments instead of reviews
      const { data, error } = await supabase
        .from('business_comments')
        .select('*, profile:profiles(*)')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      return data as Review[];
    },
  });

  useEffect(() => {
    if (data) {
      setReviews(data);
    }
  }, [data]);

  // Add a null check for the data
  const averageRating = data && data.length > 0
    ? (data.reduce((sum, review) => sum + (review.rating || 0), 0) / data.length).toFixed(1)
    : "0.0";

  if (isLoading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p>Error loading reviews.</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Customer Reviews</span>
          <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={review.profile.avatar_url || ""} />
                      <AvatarFallback>{review.profile.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{review.profile.full_name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{review.comment}</p>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
