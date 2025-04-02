
import { Skeleton } from "@/components/ui/skeleton";

interface ConversionData {
  conversion_rate: number;
  total_views: number;
  total_wishlists: number;
  total_purchases: number;
}

interface ConversionRateProps {
  data: ConversionData;
  isLoading: boolean;
}

export const ConversionRate = ({ data, isLoading }: ConversionRateProps) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[140px]" />;
  }

  const conversionRatePercent = (data?.conversion_rate || 0) * 100;

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Conversion Rate</h3>
          <div className="text-3xl font-bold text-primary">
            {conversionRatePercent.toFixed(2)}%
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Of all views, {conversionRatePercent.toFixed(2)}% convert to purchases
          </p>
        </div>
      </div>
    </div>
  );
};
