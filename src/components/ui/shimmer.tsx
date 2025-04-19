
import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div 
      className={cn(
        "animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent",
        className
      )}
      style={{
        backgroundSize: '200% 100%'
      }}
    />
  );
}
