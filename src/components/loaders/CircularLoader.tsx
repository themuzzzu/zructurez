
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
  color = "#3B82F6", // Default blue color matching the UI
  className
}: CircularLoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className="rounded-full border-2 border-t-transparent"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          borderColor: `${color}30`,
          borderTopColor: color
        }}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          ease: "linear",
          repeatType: "loop" 
        }}
      />
    </div>
  );
}
