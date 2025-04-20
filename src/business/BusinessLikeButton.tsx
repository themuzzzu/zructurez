
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface BusinessLikeButtonProps {
  businessId: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const BusinessLikeButton = ({
  businessId,
  size = "default",
  variant = "outline"
}: BusinessLikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically call an API to update like status
  };

  return (
    <Button
      onClick={toggleLike}
      size={size}
      variant={variant}
      className={`px-2 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
      title={isLiked ? "Unlike business" : "Like business"}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
    </Button>
  );
};
