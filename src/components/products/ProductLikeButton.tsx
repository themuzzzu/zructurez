
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLike } from "./LikeContext";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const { isLiked, toggleLike, isLoading: contextLoading } = useLike();
  const [isProcessing, setIsProcessing] = useState(false);
  const [animating, setAnimating] = useState(false);
  
  // Get the actual liked status
  const liked = isLiked(productId);
  const isLoading = contextLoading || isProcessing;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isLoading) return;
    
    try {
      setIsProcessing(true);
      
      // Check current status before toggle
      const willBeLiked = !liked;
      
      if (willBeLiked) {
        setAnimating(true);
        // Reset animation after it completes
        setTimeout(() => setAnimating(false), 1000);
      }
      
      // Perform the actual API call
      await toggleLike(productId);
      
      // Show toast message based on like state
      if (willBeLiked) {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
    } catch (error: any) {
      // Error is handled in the context
      if (error.message !== "Authentication required") {
        toast.error("Something went wrong");
        console.error("Error toggling product like:", error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "relative overflow-visible transition-all",
        liked ? "text-red-500" : "text-gray-400 hover:text-red-400",
        isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
      type="button"
    >
      <div className="relative z-10">
        {isLoading ? (
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
