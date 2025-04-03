
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  isLoading?: boolean;
  isLocked?: boolean;
  onUpgrade?: () => void;
}

export const SummaryCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = "neutral",
  isLoading = false,
  isLocked = false,
  onUpgrade
}: SummaryCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {change !== undefined && !isLocked && (
                <span className={`text-xs flex items-center ${
                  changeType === 'positive' ? 'text-green-500' : 
                  changeType === 'negative' ? 'text-red-500' : 
                  'text-muted-foreground'
                }`}>
                  {changeType === 'positive' ? <ArrowUp className="h-3 w-3 mr-[2px]" /> : 
                   changeType === 'negative' ? <ArrowDown className="h-3 w-3 mr-[2px]" /> : null}
                  {change}%
                </span>
              )}
            </div>
          </div>
          <div className={`p-2 rounded-full ${
            isLocked ? 'bg-muted' :
            changeType === 'positive' ? 'bg-green-100' : 
            changeType === 'negative' ? 'bg-red-100' : 
            'bg-muted'
          }`}>
            <Icon className={`h-5 w-5 ${
              isLocked ? 'text-muted-foreground' :
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 
              'text-muted-foreground'
            }`} />
          </div>
        </div>
        {isLocked && onUpgrade && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onUpgrade}
            className="w-full mt-2 text-xs"
          >
            Upgrade to unlock
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
