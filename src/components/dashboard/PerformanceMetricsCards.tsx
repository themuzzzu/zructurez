
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Package,
  Eye,
  MousePointer,
  Percent
} from "lucide-react";

interface PerformanceMetricsCardsProps {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  lowStockItems: number;
  totalImpressions: number;
  totalClicks: number;
  averageCTR: string;
}

export const PerformanceMetricsCards = ({
  totalSales,
  totalOrders,
  averageOrderValue,
  lowStockItems,
  totalImpressions,
  totalClicks,
  averageCTR
}: PerformanceMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold">₹{totalSales.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-primary/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
              <p className="text-2xl font-bold">₹{averageOrderValue.toFixed(0)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold">{lowStockItems}</p>
            </div>
            <Package className="h-8 w-8 text-primary/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ad Impressions</p>
              <p className="text-2xl font-bold">{totalImpressions.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-primary/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ad Clicks</p>
              <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
            </div>
            <MousePointer className="h-8 w-8 text-primary/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average CTR</p>
              <p className="text-2xl font-bold">{averageCTR}%</p>
            </div>
            <Percent className="h-8 w-8 text-primary/40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
