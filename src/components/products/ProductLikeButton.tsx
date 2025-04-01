
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLike } from "./LikeContext";
import { Loader2 } from "lucide-react";

interface ProductLikeButtonProps {
  productId: string;
  size?: "sm" | "icon" | "default";
  variant?: "ghost" | "outline" | "default";
  className?: string;
}

export const ProductLikeButton = ({ 
  productId, 
  size = "icon",
  variant = "ghost",
  className = ""
}: ProductLikeButtonProps) => {
  const { isLiked, toggleLike, isLoading } = useLike();
  const liked = isLiked(productId);

  return (
    <Button
      variant={variant}
      size={size}
      className={`relative ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleLike(productId);
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart 
          className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} 
        />
      )}
    </Button>
  );
};
