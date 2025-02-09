
import { useState } from 'react';
import { usePerformanceMetrics } from './hooks/usePerformanceMetrics';
import { simulateLoad } from '../../utils/performanceTracking';
import { calculateAverageResponseTime, calculateSuccessRate } from './utils/metricCalculations';
import { MetricCard } from './components/MetricCard';
import { ResponseTimeChart } from './components/ResponseTimeChart';
import { MemoryUsageChart } from './components/MemoryUsageChart';
import { ErrorList } from './components/ErrorList';

export const PerformanceDashboard = () => {
  const [isLoadTesting, setIsLoadTesting] = useState(false);
  const { combinedData, isLoading } = usePerformanceMetrics();

  const startLoadTest = async () => {
    setIsLoadTesting(true);
    try {
      await simulateLoad(5000);
    } finally {
      setIsLoadTesting(false);
    }
  };

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

  if (isLoading) {
    return <div>Loading performance metrics...</div>;
  }

  return (
    <div className="space-y-4">
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

      <ResponseTimeChart data={combinedData} />
      <MemoryUsageChart data={combinedData} />
      <ErrorList data={combinedData} />
    </div>
  );
};
