
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export interface ShimmerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  shimmerWidth?: string;
  shimmerColor?: string;
}

export function Shimmer({
  className,
  shimmerWidth = "50%",
  shimmerColor = "rgba(255, 255, 255, 0.2)",
  ...props
}: ShimmerProps) {
  return (
    <div 
      className={cn(
        "animate-pulse bg-gradient-to-r from-transparent via-gray-200 to-transparent bg-[length:200%_100%] dark:via-gray-700",
        className
      )}
      style={{
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite"
      }}
      {...props}
    />
  );
}

// Create a public folder for placeholders if it doesn't exist
