
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
