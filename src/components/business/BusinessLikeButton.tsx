
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useBusinessLikes } from "./hooks/useBusinessLikes";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface BusinessLikeButtonProps {
  businessId: string;
  size?: "sm" | "default" | "lg";
  variant?: "ghost" | "outline" | "default";
  className?: string;
  showCount?: boolean;
}

export const BusinessLikeButton = ({
  businessId,
  size = "default",
  variant = "ghost",
  className,
  showCount = true
}: BusinessLikeButtonProps) => {
  const { isLiked, likesCount, toggleLike, isLoading } = useBusinessLikes(businessId);
  const [animating, setAnimating] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isLoading) return;
    
    // Will like if currently not liked
    if (!isLiked) {
      setAnimating(true);
      // Reset animation state after animation completes
      setTimeout(() => setAnimating(false), 1000);
    }
    
    toggleLike();
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "group relative overflow-visible transition-all",
        isLiked ? "text-red-500" : "text-gray-400 hover:text-gray-500",
        className
      )}
      onClick={handleLikeClick}
      disabled={isLoading}
      type="button"
    >
      <div className="relative z-10 flex items-center gap-1">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart 
            className={cn(
              "transition-all duration-300",
              isLiked ? "fill-red-500 text-red-500" : "",
              isLiked && animating ? "scale-110" : "",
            )}
          />
        )}
        
        {showCount && (
          <span className="ml-1 transition-all duration-300">
            {likesCount}
          </span>
        )}
      </div>
      
      {/* Heart animation on like */}
      <AnimatePresence>
        {animating && isLiked && (
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
