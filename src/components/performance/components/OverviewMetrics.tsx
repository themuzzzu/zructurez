
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  ShoppingCart, 
  Heart, 
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewMetricsProps {
  businessViews: number;
  productViews: number;
  serviceViews: number;
  postViews: number;
  wishlists: number;
  orders: number;
  onRefresh?: () => void;
  isLoading?: boolean;
  lastUpdated?: string;
}

export const OverviewMetrics = ({
  businessViews,
  productViews,
  serviceViews,
  postViews,
  wishlists,
  orders,
  onRefresh,
  isLoading = false,
  lastUpdated
}: OverviewMetricsProps) => {
  const [period, setPeriod] = useState<"all" | "monthly">("all");

  // Format last updated date
  const formattedLastUpdated = lastUpdated 
    ? new Date(lastUpdated).toLocaleString() 
    : "Never";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>
            Track views, wishlists and orders
            {lastUpdated && (
              <span className="block text-xs mt-1">
                Last updated: {formattedLastUpdated}
              </span>
            )}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all" className="w-[200px]">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setPeriod("all")}>All Time</TabsTrigger>
              <TabsTrigger value="monthly" onClick={() => setPeriod("monthly")}>Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard 
            title="Business Views" 
            value={businessViews} 
            icon={<Eye className="h-4 w-4 text-blue-500" />} 
            change={period === "monthly" ? 12 : undefined}
          />
          <MetricCard 
            title="Product Views" 
            value={productViews} 
            icon={<Eye className="h-4 w-4 text-green-500" />} 
            change={period === "monthly" ? 8 : undefined}
          />
          <MetricCard 
            title="Service Views" 
            value={serviceViews} 
            icon={<Eye className="h-4 w-4 text-purple-500" />} 
            change={period === "monthly" ? 15 : undefined}
          />
          <MetricCard 
            title="Post Views" 
            value={postViews} 
            icon={<Eye className="h-4 w-4 text-yellow-500" />} 
            change={period === "monthly" ? 5 : undefined}
          />
          <MetricCard 
            title="Wishlists" 
            value={wishlists} 
            icon={<Heart className="h-4 w-4 text-red-500" />} 
            change={period === "monthly" ? -3 : undefined}
          />
          <MetricCard 
            title="Orders" 
            value={orders} 
            icon={<ShoppingCart className="h-4 w-4 text-indigo-500" />} 
            change={period === "monthly" ? 20 : undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: number;
}

const MetricCard = ({ title, value, icon, change }: MetricCardProps) => {
  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      {change !== undefined && (
        <div className={`flex items-center text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? (
            <ArrowUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 mr-1" />
          )}
          <span>{Math.abs(change)}% from last period</span>
        </div>
      )}
    </div>
  );
};

const ArrowUp = ({ className }: { className?: string }) => (
  <TrendingUp className={className} />
);

const ArrowDown = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);
