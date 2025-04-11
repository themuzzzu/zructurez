
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "extraSmall" | "small" | "medium" | "large";
}

export const StarRating = ({ rating, maxRating = 5, size = "medium" }: StarRatingProps) => {
  const stars = [];
  
  // Size configuration
  const sizeConfig = {
    extraSmall: {
      className: "h-2 w-2",
      containerClass: "gap-0.5"
    },
    small: {
      className: "h-3 w-3",
      containerClass: "gap-0.5"
    },
    medium: {
      className: "h-4 w-4",
      containerClass: "gap-1"
    },
    large: {
      className: "h-5 w-5",
      containerClass: "gap-1"
    }
  };
  
  const { className, containerClass } = sizeConfig[size];

  for (let i = 1; i <= maxRating; i++) {
    if (i <= rating) {
      stars.push(
        <Star key={i} className={`${className} fill-yellow-400 text-yellow-400`} />
      );
    } else if (i - 0.5 <= rating) {
      stars.push(
        <StarHalf key={i} className={`${className} fill-yellow-400 text-yellow-400`} />
      );
    } else {
      stars.push(
        <Star key={i} className={`${className} text-gray-300`} />
      );
    }
  }

  return <div className={`flex items-center ${containerClass}`}>{stars}</div>;
};
