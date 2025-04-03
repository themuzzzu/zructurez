
import React from 'react';
import { supabase } from "@/integrations/supabase/client";

// Track page loads
export const trackPageLoad = async (pathname: string) => {
  try {
    const startTime = performance.now();
    window.addEventListener('load', async () => {
      const loadTime = performance.now() - startTime;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('performance_metrics').insert({
          endpoint: pathname,
          response_time: loadTime,
          success: true,
          user_id: user.id
        });
      }
    });
  } catch (error) {
    console.error('Error tracking page load:', error);
  }
};

// Track API calls
export const trackApiCall = async (endpoint: string, startTime: number, success: boolean, errorMessage?: string) => {
  try {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from('performance_metrics').insert({
        endpoint,
        response_time: responseTime,
        success,
        error_message: errorMessage,
        user_id: user.id
      });
    }
  } catch (error) {
    console.error('Error tracking API call:', error);
  }
};

// Track component render time
export const useTrackRender = (componentName: string) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      console.log(`Component ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    };
  }, [componentName]);
};

// Get system info for diagnostics
export const getSystemInfo = () => {
  const connection = (navigator as any).connection;
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    devicePixelRatio: window.devicePixelRatio,
    networkType: connection ? connection.effectiveType : 'unknown',
    rtt: connection ? connection.rtt : 'unknown',
    downlink: connection ? connection.downlink : 'unknown',
    isOnline: navigator.onLine
  };
};

// Track click event
export const trackClickEvent = async (element: string, metadata?: Record<string, any>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from('performance_metrics').insert({
        endpoint: `click:${element}`,
        response_time: 0,
        success: true,
        metadata,
        user_id: user.id
      });
    }
  } catch (error) {
    console.error('Error tracking click event:', error);
  }
};

// Higher-order function to debounce function calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
