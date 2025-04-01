
import { Star } from "lucide-react";
import { BusinessLikeButton } from "./BusinessLikeButton";

interface BusinessCardRatingProps {
  rating: number;
  reviews: number;
  businessId: string;
}

export const BusinessCardRating = ({
  rating,
  reviews,
  businessId
}: BusinessCardRatingProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-sm text-yellow-400">
        <Star className="h-4 w-4 fill-current" />
        <span>{rating}</span>
        <span className="text-gray-400">({reviews} reviews)</span>
      </div>
      <BusinessLikeButton 
        businessId={businessId}
        size="sm"
        variant="ghost"
      />
    </div>
  );
};
