
import { Skeleton } from "@/components/ui/skeleton";

export const MarketplaceSkeleton = () => {
  return (
    <div className="space-y-4 w-full animate-fade-in">
      <Skeleton className="h-10 w-full max-w-2xl mx-auto rounded-lg" />
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-32 rounded-md w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};
