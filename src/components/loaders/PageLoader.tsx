
import React from "react";
import { cn } from "@/lib/utils";
import { UnifiedLoader } from "./UnifiedLoader";
import { Shimmer } from "@/components/ui/shimmer";

interface PageLoaderProps {
  type?: "shimmer" | "dots" | "pulse";
  fullScreen?: boolean;
  className?: string;
  text?: string;
}

export function PageLoader({
  type = "dots",
  fullScreen = true,
  className,
  text
}: PageLoaderProps) {
  if (type === "shimmer") {
    return (
      <div className={cn(
        "w-full h-full flex items-center justify-center",
        fullScreen && "fixed inset-0 bg-background z-50",
        className
      )}>
        <div className="w-full max-w-3xl p-4">
          <div className="space-y-4">
            {/* Header shimmer */}
            <Shimmer className="h-8 w-3/4 mx-auto" />
            
            {/* Content shimmer */}
            <Shimmer className="h-20 w-full" />
            
            {/* Grid of cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <Shimmer className="aspect-square w-full rounded-md" />
                  <Shimmer className="h-4 w-3/4" />
                  <Shimmer className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
          
          {text && <p className="text-center mt-4 text-sm text-muted-foreground">{text}</p>}
        </div>
      </div>
    );
  }
  
  return (
    <UnifiedLoader
      type={type}
      size="lg"
      isFullScreen={fullScreen}
      className={className}
      text={text}
    />
  );
}
