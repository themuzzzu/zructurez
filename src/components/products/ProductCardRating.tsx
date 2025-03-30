
import { Star } from "lucide-react";

interface ProductCardRatingProps {
  rating: number;
}

export const ProductCardRating = ({ rating }: ProductCardRatingProps) => {
  return (
    <div className="flex items-center mt-1 mb-1.5">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200"}`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-1">({rating.toFixed(1)})</span>
    </div>
  );
};
