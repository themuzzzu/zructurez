
import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
  circle?: boolean;
  rounded?: boolean;
  height?: string;
}

export function Shimmer({ className, circle, rounded, height }: ShimmerProps) {
  return (
    <div 
      className={cn(
        "animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent",
        circle && "rounded-full",
        rounded && "rounded-md",
        className
      )}
      style={{
        backgroundSize: '200% 100%',
        ...(height ? { height } : {})
      }}
    />
  );
}
