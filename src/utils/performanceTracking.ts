
import { supabase } from "@/integrations/supabase/client";

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
  
  try {
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
    
    // Only log metrics if the call took longer than 50ms (to reduce noise)
    if (responseTime > 50) {
      try {
        // Log performance metrics
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || 'anonymous';
        
        await supabase.from('performance_metrics').insert({
          endpoint,
          response_time: responseTime,
          success,
          user_id: userId,
          error_message: error?.message,
          // Additional optional metrics
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        });
      } catch (logError) {
        // Do not block the main flow if logging fails
        console.error('Failed to log performance metrics:', logError);
      }
    }
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
