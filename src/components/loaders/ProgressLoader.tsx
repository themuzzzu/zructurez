
import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useLoading } from "@/providers/LoadingProvider";

interface ProgressLoaderProps {
  showMessage?: boolean;
  className?: string;
  messageClassName?: string;
  color?: string;
  height?: number;
  fixed?: boolean;
}

export function ProgressLoader({
  showMessage = true,
  className,
  messageClassName,
  color = "primary",
  height = 4,
  fixed = false
}: ProgressLoaderProps) {
  const { progress, loadingMessage } = useLoading();
  
  if (progress === 0) return null;
  
  return (
    <div className={cn(
      "w-full", 
      fixed && "fixed top-0 left-0 z-50",
      className
    )}>
      <Progress 
        value={progress} 
        className={cn(`h-${height}`, `bg-${color}/20`)} 
        indicatorClassName={cn(`bg-${color}`)}
      />
      
      {showMessage && progress < 100 && (
        <div className={cn(
          "text-center text-sm text-muted-foreground mt-2 animate-pulse",
          messageClassName
        )}>
          {loadingMessage}
        </div>
      )}
    </div>
  );
}
