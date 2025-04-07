
import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useLoading } from "@/providers/LoadingProvider";

interface ProgressLoaderProps {
  className?: string;
  color?: string;
  height?: number;
  fixed?: boolean;
}

export function ProgressLoader({
  className,
  color = "#3B82F6", // Default blue color
  height = 4,
  fixed = false
}: ProgressLoaderProps) {
  const { progress } = useLoading();
  
  if (progress === 0) return null;
  
  return (
    <div className={cn(
      "w-full", 
      fixed && "fixed top-0 left-0 z-50",
      className
    )}>
      <Progress 
        value={progress} 
        className={cn(`h-${height}`, "bg-black/5 dark:bg-white/5")} 
        indicatorClassName="bg-blue-500" 
      />
    </div>
  );
}
