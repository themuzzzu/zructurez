
export const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString();
};

export const calculateAverageResponseTime = (data: any[]) => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, curr) => acc + curr.response_time, 0);
  return Math.round(sum / data.length);
};

export const calculateSuccessRate = (data: any[]) => {
  if (data.length === 0) return 0;
  const successCount = data.filter(m => m.success).length;
  return Math.round((successCount / data.length) * 100);
};

export const getMemoryUsageTrend = (data: any[]) => {
  return data
    .filter(m => m.memory_usage != null)
    .map(m => ({
      timestamp: m.timestamp,
      memory_usage: Math.round(m.memory_usage * 100) / 100
    }));
};

// New function to get slow API calls for reporting
export const getSlowApiCalls = (data: any[], thresholdMs: number = 500) => {
  return data
    .filter(m => m.response_time > thresholdMs)
    .sort((a, b) => b.response_time - a.response_time);
};

// New function to calculate average memory usage
export const calculateAverageMemoryUsage = (data: any[]) => {
  const memoryData = data.filter(m => m.memory_usage != null);
  if (memoryData.length === 0) return 0;
  
  const sum = memoryData.reduce((acc, curr) => acc + curr.memory_usage, 0);
  return Math.round((sum / memoryData.length) * 100) / 100;
};
