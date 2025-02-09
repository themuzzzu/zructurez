
import { supabase } from "@/integrations/supabase/client";

interface PerformanceMetric {
  endpoint: string;
  response_time: number;
  success: boolean;
  error_message?: string;
  metadata?: Record<string, any>;
  user_id: string;
  cpu_usage?: number;
  memory_usage?: number;
  concurrent_users?: number;
}

// Use a WeakMap to store active sessions without memory leaks
const activeSessions = new WeakMap<object, boolean>();

const getCurrentPerformanceMetrics = () => {
  let memoryUsage = null;
  
  // Check if performance.memory is available (Chrome only)
  if (typeof window !== 'undefined' && 
      window.performance && 
      (window.performance as any).memory) {
    const memory = (window.performance as any).memory;
    memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
  }

  // Get approximate concurrent users count
  const sessionCount = Object.keys(sessionStorage).length;

  return {
    cpu_usage: null, // Browser API doesn't provide CPU usage
    memory_usage: memoryUsage,
    concurrent_users: sessionCount
  };
};

export const trackPerformance = async (metric: PerformanceMetric) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found for performance tracking');
      return;
    }

    const performanceMetrics = getCurrentPerformanceMetrics();
    const { error } = await supabase
      .from('performance_metrics')
      .insert([{
        ...metric,
        ...performanceMetrics,
        timestamp: new Date().toISOString(),
        user_id: user.id // Ensure we always use the authenticated user's ID
      }]);

    if (error) {
      console.error('Error tracking performance:', error);
    }
  } catch (err) {
    console.error('Failed to track performance:', err);
  }
};

export const measureApiCall = async <T>(
  endpoint: string,
  apiCall: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No authenticated user found');
  }
  
  const startTime = performance.now();
  try {
    const result = await apiCall();
    const endTime = performance.now();
    
    await trackPerformance({
      endpoint,
      response_time: endTime - startTime,
      success: true,
      metadata,
      user_id: user.id
    });

    return result;
  } catch (error) {
    const endTime = performance.now();
    
    await trackPerformance({
      endpoint,
      response_time: endTime - startTime,
      success: false,
      error_message: error instanceof Error ? error.message : 'Unknown error',
      metadata,
      user_id: user.id
    });

    throw error;
  }
};

// Load test simulation helper
export const simulateLoad = async (userCount: number = 5000) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No authenticated user found for load test');
  }

  const endpoints = ['/api/users', '/api/posts', '/api/comments'];
  const requests = Array.from({ length: userCount }, async () => {
    const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    return trackPerformance({
      endpoint: randomEndpoint,
      response_time: Math.random() * 1000, // Simulate random response times
      success: Math.random() > 0.1, // 90% success rate
      user_id: user.id,
      concurrent_users: userCount
    });
  });

  return Promise.all(requests);
};
