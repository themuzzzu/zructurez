
import { useAuth } from "@/hooks/useAuth";
import { useBusinessAnalytics } from "../performance/hooks/useBusinessAnalytics";
import { BusinessAnalyticsCharts } from "../performance/components/BusinessAnalyticsCharts";
import { PerformanceDashboard } from "../performance/PerformanceDashboard";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";

export const TestingTab = () => {
  const { user } = useAuth();
  const { data: businessAnalytics, isLoading, refetch } = useBusinessAnalytics(user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Business Analytics Testing</h2>
        <Card className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !businessAnalytics ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No analytics data available</p>
              <p className="text-sm text-muted-foreground mt-2">Analytics data will appear when your business receives views</p>
            </div>
          ) : (
            <BusinessAnalyticsCharts 
              data={businessAnalytics} 
              onRefresh={() => refetch()}
              isLoading={isLoading}
            />
          )}
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold mb-4">Performance Testing</h2>
        <Card className="p-6">
          <PerformanceDashboard />
        </Card>
      </div>
    </div>
  );
};
