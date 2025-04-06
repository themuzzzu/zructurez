
import React, { useEffect } from "react";
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
  color = "primary",
  height = 4,
  fixed = true
}: ProgressLoaderProps) {
  const { progress, isLoading } = useLoading();
  
  // Animate progress bar if it gets stuck
  useEffect(() => {
    let animationTimer: number | null = null;
    
    if (isLoading && progress > 0 && progress < 100 && progress === progress) {
      // If progress gets stuck for more than 3 seconds, nudge it forward
      animationTimer = window.setTimeout(() => {
        const newProgress = Math.min(progress + 5, 99);
        console.log(`Progress stuck at ${progress}, nudging to ${newProgress}`);
      }, 3000);
    }
    
    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
    };
  }, [progress, isLoading]);
  
  if (progress === 0 && !isLoading) return null;
  
  return (
    <div className={cn(
      "w-full z-50 transition-opacity duration-300",
      progress === 100 ? "opacity-0" : "opacity-100", 
      fixed && "fixed top-0 left-0",
      className
    )}>
      <Progress 
        value={progress} 
        className={cn(`h-${height}`, `bg-${color}/20`)} 
        indicatorClassName={cn(`bg-${color}`)}
      />
    </div>
  );
}
