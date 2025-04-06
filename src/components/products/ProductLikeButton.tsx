
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import { useLikes } from "./LikeContext";

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
  const { isLiked, toggleLike } = useLikes();
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get the actual liked status
  const liked = isLiked(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (loading) return;
    setLoading(true);
    
    if (!liked) {
      // Only animate when adding to wishlist
      setAnimating(true);
      // Reset animation after it completes
      setTimeout(() => setAnimating(false), 1000);
    }
    
    // Call the toggleLike function
    await toggleLike(productId);
    setLoading(false);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "relative overflow-visible transition-all",
        liked ? "text-red-500" : "text-gray-400 hover:text-red-400",
        loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      onClick={handleClick}
      disabled={loading}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
      type="button"
    >
      <div className="relative z-10">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart 
            className={cn(
              "transition-all duration-300",
              liked ? "fill-red-500 text-red-500" : "",
              liked && animating ? "scale-110" : "",
            )}
          />
        )}
      </div>
      
      {/* Heart animation on like */}
      <AnimatePresence>
        {animating && liked && (
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ 
                  scale: 1.5, 
                  opacity: 0,
                  x: Math.random() * 20 - 10,
                  y: Math.random() * -30 - 10
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute w-3 h-3 rounded-full bg-red-400"
              />
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute w-8 h-8 rounded-full bg-red-200"
            />
          </div>
        )}
      </AnimatePresence>
    </Button>
  );
};
