
import { Skeleton } from "@/components/ui/skeleton";

interface ConversionData {
  conversion_rate: number;
  total_views: number;
  total_wishlists: number;
  total_purchases: number;
}

interface DropOffRateProps {
  data: ConversionData;
  isLoading: boolean;
}

export const DropOffRate = ({ data, isLoading }: DropOffRateProps) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[140px]" />;
  }

  const dropOffRatePercent = 100 - ((data?.conversion_rate || 0) * 100);

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Drop-Off Rate</h3>
          <div className="text-3xl font-bold text-red-500">
            {dropOffRatePercent.toFixed(2)}%
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Users who view but don't purchase
          </p>
        </div>
      </div>
    </div>
  );
};
