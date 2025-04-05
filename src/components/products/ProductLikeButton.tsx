
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLike } from "./LikeContext";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
  const [animating, setAnimating] = useState(false);
  const [localLiked, setLocalLiked] = useState<boolean | null>(null);

  // Get the actual liked status, with optimistic UI update
  const liked = localLiked !== null ? localLiked : isLiked(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isLoading) return;
    
    // Optimistic update
    const newLikedState = !liked;
    setLocalLiked(newLikedState);
    setAnimating(true);
    
    try {
      await toggleLike(productId);
      
      // Show toast message based on like state
      if (newLikedState) {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      // Revert on error
      setLocalLiked(!newLikedState);
      toast.error("Something went wrong");
    } finally {
      // Reset animation state after animation completes
      setTimeout(() => {
        setAnimating(false);
        setLocalLiked(null); // Reset to use the actual state
      }, 1000);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`relative group border-none bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 ${className}`}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
    >
      <div className="relative z-10">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
        ) : (
          <Heart 
            className={`h-4 w-4 transition-all duration-300 
            ${liked ? 'fill-red-500 text-red-500' : 'text-red-500'} 
            ${liked && animating ? 'scale-110' : ''}`} 
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
