
import { useAuth } from "@/hooks/useAuth";
import { useBusinessAnalytics } from "../performance/hooks/useBusinessAnalytics";
import { BusinessAnalyticsCharts } from "../performance/components/BusinessAnalyticsCharts";
import { Card } from "../ui/card";

export const AnalyticsTab = () => {
  const { user } = useAuth();
  const { data: businessAnalytics, isLoading } = useBusinessAnalytics(user?.id);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading analytics...</div>
      </Card>
    );
  }

  if (!businessAnalytics) {
    return (
      <Card className="p-6">
        <div className="text-center">No analytics data available</div>
      </Card>
    );
  }

  return <BusinessAnalyticsCharts data={businessAnalytics} />;
};
