
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface OverviewMetricsProps {
  businessViews: number;
  productViews: number;
  serviceViews: number;
  postViews: number;
  wishlists: number;
  orders: number;
  lastUpdated: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const OverviewMetrics = ({
  businessViews,
  productViews,
  serviceViews,
  postViews,
  wishlists,
  orders,
  lastUpdated,
  onRefresh,
  isLoading = false,
}: OverviewMetricsProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'recently';
    }
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Performance Overview
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Last updated: {formatDate(lastUpdated)}
        </p>
      </div>
      <div className="p-6 pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Business Profile</p>
            <p className="text-2xl font-bold">{businessViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Page views</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Products</p>
            <p className="text-2xl font-bold">{productViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total views</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Services</p>
            <p className="text-2xl font-bold">{serviceViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total views</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Posts</p>
            <p className="text-2xl font-bold">{postViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total views</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Wishlists</p>
            <p className="text-2xl font-bold">{wishlists.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Saved items</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Orders</p>
            <p className="text-2xl font-bold">{orders.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Completed transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};
