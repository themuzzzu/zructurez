
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export interface ShimmerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  shimmerWidth?: string;
  shimmerColor?: string;
  rounded?: boolean;
  circle?: boolean;
}

export function Shimmer({
  className,
  shimmerWidth = "50%",
  shimmerColor = "rgba(255, 255, 255, 0.2)",
  rounded = false,
  circle = false,
  ...props
}: ShimmerProps) {
  return (
    <div 
      className={cn(
        "animate-pulse bg-gradient-to-r from-transparent via-gray-200 to-transparent bg-[length:200%_100%] dark:via-gray-700",
        rounded && "rounded-md",
        circle && "rounded-full",
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
