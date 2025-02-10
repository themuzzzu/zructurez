
import { useAuth } from "@/hooks/useAuth";
import { useBusinessAnalytics } from "../performance/hooks/useBusinessAnalytics";
import { BusinessAnalyticsCharts } from "../performance/components/BusinessAnalyticsCharts";
import { PerformanceDashboard } from "../performance/PerformanceDashboard";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

export const AnalyticsTab = () => {
  const { user } = useAuth();
  const { data: businessAnalytics, isLoading } = useBusinessAnalytics(user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Performance Testing</h2>
        <Card className="p-6">
          <PerformanceDashboard />
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold mb-4">Business Analytics</h2>
        <Card className="p-6">
          {isLoading ? (
            <div className="text-center">Loading analytics...</div>
          ) : !businessAnalytics ? (
            <div className="text-center">No analytics data available</div>
          ) : (
            <BusinessAnalyticsCharts data={businessAnalytics} />
          )}
        </Card>
      </div>
    </div>
  );
};
