
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
