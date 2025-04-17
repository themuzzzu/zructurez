
import { cn } from "@/lib/utils";
import React from "react";

export interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  rounded?: boolean;
  circle?: boolean;
}

const Shimmer = React.forwardRef<HTMLDivElement, ShimmerProps>(
  ({ className, rounded, circle, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-muted",
          rounded && "rounded",
          circle && "rounded-full",
          className
        )}
        {...props}
      />
    );
  }
);
Shimmer.displayName = "Shimmer";

export { Shimmer };
