
import { Skeleton } from "@/components/ui/skeleton";

interface EngagementData {
  hour: string;
  engagement: number;
}

interface BestPostingTimesProps {
  data: EngagementData[];
  isLoading: boolean;
}

export const BestPostingTimes = ({ data, isLoading }: BestPostingTimesProps) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[140px]" />;
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Best Posting Times</h3>
            <div className="text-muted-foreground">
              No engagement data available
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format hour to 12-hour format with AM/PM
  const formatHour = (hour: string) => {
    const hourNum = parseInt(hour);
    if (hourNum === 0) return '12 AM';
    if (hourNum === 12) return '12 PM';
    return hourNum < 12 ? `${hourNum} AM` : `${hourNum - 12} PM`;
  };

  // Find the best 3 posting times based on engagement
  const bestTimes = [...data]
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 3)
    .map(item => formatHour(item.hour));

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Best Posting Times</h3>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {bestTimes.map((time, index) => (
              <div key={index} className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                {time}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            AI-recommended times based on historical engagement
          </p>
        </div>
      </div>
    </div>
  );
};
