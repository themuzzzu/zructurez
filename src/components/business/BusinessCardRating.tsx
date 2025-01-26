import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessCardRatingProps {
  rating: number;
  reviews: number;
  isLiked: boolean;
  likesCount: number;
  onLikeClick: (e: React.MouseEvent) => void;
}

export const BusinessCardRating = ({
  rating,
  reviews,
  isLiked,
  likesCount,
  onLikeClick
}: BusinessCardRatingProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-sm text-yellow-400">
        <Star className="h-4 w-4 fill-current" />
        <span>{rating}</span>
        <span className="text-gray-400">({reviews} reviews)</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className={`p-0 hover:bg-transparent ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
        onClick={onLikeClick}
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        <span className="ml-1 text-sm">{likesCount}</span>
      </Button>
    </div>
  );
};