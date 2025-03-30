
import { ViewsChart } from "./ViewsChart";
import { TopPerformingEntities } from "./TopPerformingEntities";
import { OverviewMetrics } from "./OverviewMetrics";

interface BusinessAnalyticsData {
  businessViews: number;
  productAnalytics: Array<{
    id: string;
    title: string;
    views: number;
  }>;
  serviceAnalytics: Array<{
    id: string;
    title: string;
    views: number;
  }>;
  postAnalytics: Array<{
    id: string;
    content: string;
    views: number;
  }>;
  lastUpdated: string;
}

interface BusinessAnalyticsChartsProps {
  data: BusinessAnalyticsData;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const BusinessAnalyticsCharts = ({
  data,
  onRefresh,
  isLoading = false,
}: BusinessAnalyticsChartsProps) => {
  // Calculate total views
  const totalProductViews = data.productAnalytics.reduce((sum, item) => sum + item.views, 0);
  const totalServiceViews = data.serviceAnalytics.reduce((sum, item) => sum + item.views, 0);
  const totalPostViews = data.postAnalytics.reduce((sum, item) => sum + item.views, 0);
  
  // Prepare data for charts
  const productChartData = data.productAnalytics.map(item => ({
    name: item.title,
    views: item.views,
  }));
  
  const serviceChartData = data.serviceAnalytics.map(item => ({
    name: item.title,
    views: item.views,
  }));
  
  const postChartData = data.postAnalytics.map(item => ({
    name: item.content.substring(0, 20) + (item.content.length > 20 ? "..." : ""),
    views: item.views,
  }));
  
  return (
    <div className="space-y-6">
      <OverviewMetrics
        businessViews={data.businessViews}
        productViews={totalProductViews}
        serviceViews={totalServiceViews}
        postViews={totalPostViews}
        wishlists={0} // We'll implement this in a future update
        orders={0} // We'll implement this in a future update
        onRefresh={onRefresh}
        isLoading={isLoading}
        lastUpdated={data.lastUpdated}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ViewsChart
          data={productChartData}
          title="Product Views"
          description="Views per product"
          valueKey="views"
          nameKey="name"
        />
        
        <ViewsChart
          data={serviceChartData}
          title="Service Views"
          description="Views per service"
          valueKey="views"
          nameKey="name"
        />
      </div>
      
      <TopPerformingEntities
        products={data.productAnalytics}
        services={data.serviceAnalytics}
        posts={data.postAnalytics}
      />
      
      <ViewsChart
        data={postChartData}
        title="Post Views"
        description="Views per post"
        valueKey="views"
        nameKey="name"
      />
    </div>
  );
};
