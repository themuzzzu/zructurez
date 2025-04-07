
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CircularLoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export function CircularLoader({ 
  size = 40, 
  color = "currentColor",
  className
}: CircularLoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className="rounded-full border-2 border-t-transparent"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          borderColor: `${color}20`,
          borderTopColor: color
        }}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
    </div>
  );
}
