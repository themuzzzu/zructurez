
import React from "react";
import { cn } from "@/lib/utils";
import { Shimmer } from "@/components/ui/shimmer";

interface UnifiedLoaderProps {
  type?: "shimmer" | "dots" | "pulse";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  text?: string;
  isFullScreen?: boolean;
  count?: number;
}

export const UnifiedLoader = ({
  type = "shimmer",
  size = "md",
  className,
  text,
  isFullScreen = false,
  count = 1
}: UnifiedLoaderProps) => {
  // Size mapping
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  };
  
  // Shimmer effect (default)
  if (type === "shimmer") {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center",
        isFullScreen && "min-h-screen w-full",
        className
      )}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {Array(count).fill(0).map((_, i) => (
            <Shimmer 
              key={i}
              className={cn(
                "rounded-md", 
                size === "xs" ? "h-16" : 
                size === "sm" ? "h-24" : 
                size === "md" ? "h-32" : 
                "h-48"
              )} 
            />
          ))}
        </div>
        {text && <p className="mt-4 text-sm text-muted-foreground">{text}</p>}
      </div>
    );
  }
  
  // Dots loader
  if (type === "dots") {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center",
        isFullScreen && "min-h-screen w-full",
        className
      )}>
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-primary rounded-full animate-pulse",
                sizeClasses.xs,
                { "animate-delay-100": i === 0 },
                { "animate-delay-200": i === 1 },
                { "animate-delay-300": i === 2 }
              )}
              style={{
                animationDelay: `${i * 0.15}s`
              }}
            ></div>
          ))}
        </div>
        {text && <p className="mt-4 text-sm text-muted-foreground">{text}</p>}
      </div>
    );
  }
  
  // Pulse loader
  if (type === "pulse") {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center",
        isFullScreen && "min-h-screen w-full",
        className
      )}>
        <div
          className={cn(
            "rounded-full bg-primary/20 animate-pulse relative",
            sizeClasses[size]
          )}
        >
          <div className="absolute inset-0 rounded-full bg-primary/40 scale-50 animate-ping"></div>
        </div>
        {text && <p className="mt-4 text-sm text-muted-foreground">{text}</p>}
      </div>
    );
  }
  
  return null;
};
