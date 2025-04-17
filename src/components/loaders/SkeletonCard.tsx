
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
  rounded?: boolean;
  circle?: boolean;
}

// Create a custom Shimmer component that accepts className, rounded, and circle props
const Shimmer = ({ className, rounded = false, circle = false }: ShimmerProps) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-300 dark:bg-gray-700",
        rounded && "rounded",
        circle && "rounded-full",
        className
      )}
    />
  );
};

export const SkeletonCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn("overflow-hidden p-0", className)}>
      {/* Image placeholder */}
      <Shimmer className="w-full h-44" rounded={true} />

      {/* Content placeholders */}
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-2 mb-4">
          <Shimmer className="w-10 h-10" circle={true} />
          <div className="flex-1">
            <Shimmer className="h-4 w-2/3 mb-2" rounded={true} />
            <Shimmer className="h-3 w-1/2" rounded={true} />
          </div>
        </div>

        {/* Title and description */}
        <Shimmer className="h-5 w-3/4" rounded={true} />
        <Shimmer className="h-4 w-full" rounded={true} />
        <Shimmer className="h-4 w-5/6" rounded={true} />

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <Shimmer className="h-8 w-24" rounded={true} />
          <Shimmer className="h-8 w-24" rounded={true} />
        </div>
      </div>
    </Card>
  );
};

export default SkeletonCard;
