
import { supabase } from "@/integrations/supabase/client";

interface PerformanceMetric {
  endpoint: string;
  response_time: number;
  success: boolean;
  error_message?: string;
  metadata?: Record<string, any>;
  user_id: string;
}

export const trackPerformance = async (metric: PerformanceMetric) => {
  try {
    const { error } = await supabase
      .from('performance_metrics')
      .insert([metric]);

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
  
  const startTime = performance.now();
  try {
    const result = await apiCall();
    const endTime = performance.now();
    
    await trackPerformance({
      endpoint,
      response_time: endTime - startTime,
      success: true,
      metadata,
      user_id: user?.id as string
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
      user_id: user?.id as string
    });

    throw error;
  }
};
