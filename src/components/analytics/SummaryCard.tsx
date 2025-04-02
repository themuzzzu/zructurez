
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  isLoading?: boolean;
}

export const SummaryCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  isLoading = false
}: SummaryCardProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-9 w-24 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            
            {change !== undefined && (
              <div className="flex items-center mt-2">
                {changeType === 'positive' && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                {changeType === 'negative' && <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />}
                <span className={`text-sm font-medium ${
                  changeType === 'positive' ? 'text-green-500' : 
                  changeType === 'negative' ? 'text-red-500' : 'text-muted-foreground'
                }`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};
