
import React from "react";
import { cn } from "@/lib/utils";
import { Shimmer } from "@/components/ui/shimmer";
import { motion } from "framer-motion";

interface PageLoaderProps {
  type?: "spinner" | "dots" | "shimmer";
  className?: string;
  fullScreen?: boolean;
}

export function PageLoader({
  type = "shimmer",
  className,
  fullScreen = true
}: PageLoaderProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      fullScreen ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" : "w-full py-12",
      className
    )}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {type === "shimmer" && (
          <div className="flex flex-col gap-4 w-48">
            <Shimmer height="12px" rounded className="w-3/4 mx-auto" />
            <Shimmer height="12px" rounded className="w-full" />
            <Shimmer height="12px" rounded className="w-5/6 mx-auto" />
          </div>
        )}
        
        {type === "spinner" && (
          <div className="h-12 w-12 rounded-full border-4 border-muted-foreground/30 border-t-primary animate-spin" />
        )}
        
        {type === "dots" && (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-3 w-3 bg-primary rounded-full"
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: "easeInOut" 
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
