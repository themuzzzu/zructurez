
import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
  rounded?: boolean;
  circle?: boolean;
}

export function Shimmer({ className, rounded, circle }: ShimmerProps) {
  return (
    <div 
      className={cn(
        "animate-pulse overflow-hidden relative",
        rounded && "rounded-md",
        circle && "rounded-full",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-animation"></div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .shimmer-animation {
          animation: shimmer 1.5s infinite;
        }
      `}} />
    </div>
  );
}
