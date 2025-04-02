
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface LiveUpdateProps {
  lastUpdate: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const LiveUpdate = ({ lastUpdate, onRefresh, isRefreshing }: LiveUpdateProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Last updated: {lastUpdate}</span>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};
