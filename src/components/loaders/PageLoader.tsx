
import React from "react";
import { cn } from "@/lib/utils";
import { BouncingLoader } from "./BouncingLoader";
import { RangoliLoader } from "./RangoliLoader";
import { useLoading } from "@/providers/LoadingProvider";
import { motion } from "framer-motion";

interface PageLoaderProps {
  type?: "bouncing" | "rangoli";
  className?: string;
  fullScreen?: boolean;
  showMessage?: boolean;
  messageClassName?: string;
  iconType?: ("car" | "coffee" | "palmtree" | "dot")[];
}

export function PageLoader({
  type = "rangoli",
  className,
  fullScreen = true,
  showMessage = false, // Default to false to hide messages
  messageClassName,
  iconType = ["car", "coffee", "palmtree"],
}: PageLoaderProps) {
  const { loadingMessage } = useLoading();
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      fullScreen ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" : "w-full py-12",
      className
    )}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-4"
      >
        {type === "rangoli" ? (
          <RangoliLoader size="lg" />
        ) : (
          <BouncingLoader size="lg" iconType={iconType} count={3} />
        )}
        
        {showMessage && (
          <motion.p 
            className={cn(
              "text-center text-muted-foreground animate-pulse",
              messageClassName
            )}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2
            }}
          >
            {loadingMessage}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
