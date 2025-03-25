
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Configuration for performance thresholds
const PERFORMANCE_THRESHOLDS = {
  SLOW_API_THRESHOLD_MS: 500, // API calls taking longer than 500ms are considered slow
  MEMORY_WARNING_THRESHOLD: 80, // Memory usage above 80% triggers a warning
  MEMORY_CRITICAL_THRESHOLD: 90, // Memory usage above 90% is considered critical
};

/**
 * Function to measure the performance of API calls
 * @param endpoint The name/identifier of the API endpoint
 * @param apiFn The API function to measure
 * @returns The result of the API call
 */
export const measureApiCall = async <T>(
  endpoint: string,
  apiFn: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  let success = false;
  let error: Error | null = null;
  let memoryUsage: number | null = null;
  
  try {
    // Get memory usage before the call (if available in the browser)
    try {
      if (performance && 'memory' in performance) {
        // Safely access memory properties
        const memory = (performance as any).memory;
        if (memory && typeof memory.usedJSHeapSize === 'number' && typeof memory.jsHeapSizeLimit === 'number') {
          memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        }
      }
    } catch (memError) {
      console.debug('Memory usage measurement not supported');
    }
    
    // Execute the API call
    const result = await apiFn();
    success = true;
    return result;
  } catch (e) {
    error = e instanceof Error ? e : new Error(String(e));
    throw error;
  } finally {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // Always log performance metrics for proper analytics
    try {
      // Log performance metrics
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      
      const metricsData = {
        endpoint,
        response_time: responseTime,
        success,
        user_id: userId,
        error_message: error?.message,
        memory_usage: memoryUsage,
        timestamp: new Date().toISOString(),
        // Additional optional metrics
        metadata: {
          userAgent: navigator.userAgent,
          concurrent_users: document.visibilityState === 'visible' ? 1 : 0,
          path: window.location.pathname
        }
      };
      
      await supabase.from('performance_metrics').insert([metricsData]);
      
      // Alert for slow API responses
      if (responseTime > PERFORMANCE_THRESHOLDS.SLOW_API_THRESHOLD_MS) {
        console.warn(`[Performance] Slow API call to ${endpoint}: ${responseTime.toFixed(2)}ms`);
        
        // Only show toast warning to admin users and on significant delays
        if (responseTime > PERFORMANCE_THRESHOLDS.SLOW_API_THRESHOLD_MS * 2) {
          const isAdmin = await isUserAdmin();
          if (isAdmin) {
            toast.warning(`Slow API response detected: ${endpoint} (${responseTime.toFixed(0)}ms)`);
          }
        }
      }
      
      // Alert for high memory usage
      if (memoryUsage !== null) {
        if (memoryUsage > PERFORMANCE_THRESHOLDS.MEMORY_CRITICAL_THRESHOLD) {
          console.error(`[Performance] Critical memory usage: ${memoryUsage.toFixed(2)}%`);
          const isAdmin = await isUserAdmin();
          if (isAdmin) {
            toast.error(`Critical memory usage: ${memoryUsage.toFixed(1)}%`);
          }
        } else if (memoryUsage > PERFORMANCE_THRESHOLDS.MEMORY_WARNING_THRESHOLD) {
          console.warn(`[Performance] High memory usage: ${memoryUsage.toFixed(2)}%`);
          const isAdmin = await isUserAdmin();
          if (isAdmin) {
            toast.warning(`High memory usage: ${memoryUsage.toFixed(1)}%`);
          }
        }
      }
    } catch (logError) {
      // Do not block the main flow if logging fails
      console.error('Failed to log performance metrics:', logError);
    }
  }
};

// Helper function to check if current user is an admin
const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Same admin check as in adminApiMiddleware.ts
    const adminIds = [
      'feb4a063-6dfc-4b6f-a1d9-0fc2c57c04db', // Example admin ID
      // Add more admin IDs as needed
    ];
    
    return adminIds.includes(user.id);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Function to track component render times
 * @param componentName The name of the component
 * @param renderFn The render function to measure
 * @returns The result of the render function
 */
export const measureRenderTime = <T>(
  componentName: string,
  renderFn: () => T
): T => {
  const startTime = performance.now();
  
  try {
    return renderFn();
  } finally {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Only log if render takes longer than 16ms (approx. 60fps threshold)
    if (renderTime > 16) {
      console.debug(`[Performance] ${componentName} render: ${renderTime.toFixed(2)}ms`);
      
      // Log to performance metrics for renders that take significantly longer
      if (renderTime > 100) {
        try {
          supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            
            supabase.from('performance_metrics').insert([{
              endpoint: `render-${componentName}`,
              response_time: renderTime,
              success: true,
              user_id: user.id,
              timestamp: new Date().toISOString()
            }]);
          });
        } catch (error) {
          // Silent fail for render metrics
        }
      }
    }
  }
};

/**
 * Simulates a load test with a specified number of concurrent users
 * @param userCount The number of simulated users
 * @returns A promise that resolves when the load test is complete
 */
export const simulateLoad = async (userCount: number): Promise<void> => {
  console.log(`Starting load test with ${userCount} simulated users`);
  
  // Create an array of dummy API calls to simulate concurrent users
  const simulatedCalls = Array.from({ length: userCount }).map(async (_, index) => {
    const delay = Math.random() * 1000; // Random delay between 0-1000ms
    
    try {
      // Simulate a random API call
      await measureApiCall(`load-test-${index}`, async () => {
        // Simulate network latency and processing time
        await new Promise(resolve => setTimeout(resolve, delay));
        return { success: true, userId: `user-${index}` };
      });
    } catch (error) {
      console.error(`Error in simulated call ${index}:`, error);
    }
  });
  
  // Wait for all simulated calls to complete
  await Promise.all(simulatedCalls);
  
  // Log a summary to the performance metrics table
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    
    await supabase.from('performance_metrics').insert({
      endpoint: 'load-test-summary',
      response_time: 0, // Not applicable for summary
      success: true,
      user_id: userId,
      error_message: null,
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        concurrent_users: userCount,
        test_type: 'simulation'
      }
    });
    
    console.log(`Load test with ${userCount} simulated users completed`);
  } catch (error) {
    console.error('Failed to log load test summary:', error);
  }
};

// Add a helper function to get memory usage
export const getMemoryUsage = (): number | null => {
  try {
    if (performance && 'memory' in performance) {
      // Safely access memory properties
      const memory = (performance as any).memory;
      if (memory && typeof memory.usedJSHeapSize === 'number' && typeof memory.jsHeapSizeLimit === 'number') {
        return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      }
    }
  } catch (error) {
    console.debug('Memory usage measurement not supported');
  }
  return null;
};
