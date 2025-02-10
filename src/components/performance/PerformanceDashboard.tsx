
import { useState } from 'react';
import { usePerformanceMetrics } from './hooks/usePerformanceMetrics';
import { useBusinessAnalytics } from './hooks/useBusinessAnalytics';
import { simulateLoad } from '../../utils/performanceTracking';
import { calculateAverageResponseTime, calculateSuccessRate } from './utils/metricCalculations';
import { MetricCard } from './components/MetricCard';
import { ResponseTimeChart } from './components/ResponseTimeChart';
import { MemoryUsageChart } from './components/MemoryUsageChart';
import { ErrorList } from './components/ErrorList';
import { BusinessAnalyticsCharts } from './components/BusinessAnalyticsCharts';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const PerformanceDashboard = () => {
  const [isLoadTesting, setIsLoadTesting] = useState(false);
  const { combinedData, isLoading } = usePerformanceMetrics();
  const { user } = useAuth();
  
  // Assuming the business ID is stored in the user metadata or can be fetched
  // You'll need to modify this based on your actual business ID retrieval logic
  const businessId = user?.id; // This should be replaced with actual business ID
  const { data: businessAnalytics, isLoading: isLoadingAnalytics } = useBusinessAnalytics(businessId || '');

  const startLoadTest = async () => {
    if (!user) {
      toast.error('Please login to run load tests');
      return;
    }
    
    setIsLoadTesting(true);
    try {
      await simulateLoad(5000);
      toast.success('Load test completed successfully');
    } catch (error) {
      console.error('Load test failed:', error);
      toast.error('Load test failed. Please try again.');
    } finally {
      setIsLoadTesting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg text-muted-foreground">Please login to view performance metrics</p>
      </div>
    );
  }

  if (isLoadTesting) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Running load test with 5000 simulated users...</p>
          <p className="text-sm text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (isLoading || isLoadingAnalytics) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={startLoadTest}
          disabled={isLoadTesting}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Run Load Test (5000 users)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <MetricCard
          title="Avg Response Time"
          description="Average API response time"
          value={`${calculateAverageResponseTime(combinedData)}ms`}
        />
        <MetricCard
          title="Success Rate"
          description="API call success rate"
          value={`${calculateSuccessRate(combinedData)}%`}
        />
        <MetricCard
          title="Active Users"
          description="Currently active users"
          value={combinedData[0]?.concurrent_users || 'N/A'}
        />
      </div>

      {businessAnalytics && <BusinessAnalyticsCharts data={businessAnalytics} />}

      <ResponseTimeChart data={combinedData} />
      <MemoryUsageChart data={combinedData} />
      <ErrorList data={combinedData} />
    </div>
  );
};
