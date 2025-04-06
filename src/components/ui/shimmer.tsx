
import { cn } from "@/lib/utils";

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: boolean;
  circle?: boolean;
  className?: string;
}

export function Shimmer({ 
  width = "100%", 
  height = "100%", 
  rounded = false, 
  circle = false, 
  className, 
  ...props 
}: ShimmerProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-muted/70 via-muted/90 to-muted/70 bg-[length:400%_400%] animate-shimmer",
        rounded && "rounded-md",
        circle && "rounded-full",
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
}
