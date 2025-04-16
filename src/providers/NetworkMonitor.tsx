
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { queryClient } from '@/lib/react-query';

interface NetworkStatusContextType {
  isOnline: boolean;
  connectionQuality: 'unknown' | 'poor' | 'good' | 'excellent';
  latency: number | null;
}

const NetworkStatusContext = createContext<NetworkStatusContextType>({
  isOnline: true,
  connectionQuality: 'unknown',
  latency: null
});

export function useNetworkStatus() {
  return useContext(NetworkStatusContext);
}

interface NetworkMonitorProps {
  children: ReactNode;
  showToasts?: boolean;
}

export function NetworkMonitor({ children, showToasts = true }: NetworkMonitorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'unknown' | 'poor' | 'good' | 'excellent'>('unknown');
  const [latency, setLatency] = useState<number | null>(null);
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (showToasts) toast.success("You're back online!");
      
      // Refetch any stale queries when coming back online
      queryClient.refetchQueries();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      if (showToasts) toast.error("You're offline. Some features may be unavailable.");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToasts]);
  
  // Monitor connection quality if available
  useEffect(() => {
    const connection = (navigator as any).connection;
    
    if (connection) {
      const updateConnectionQuality = () => {
        const effectiveType = connection.effectiveType;
        
        // Map connection types to quality levels
        switch (effectiveType) {
          case 'slow-2g':
          case '2g':
            setConnectionQuality('poor');
            break;
          case '3g':
            setConnectionQuality('good');
            break;
          case '4g':
            setConnectionQuality('excellent');
            break;
          default:
            setConnectionQuality('unknown');
        }
      };
      
      updateConnectionQuality();
      connection.addEventListener('change', updateConnectionQuality);
      
      return () => {
        connection.removeEventListener('change', updateConnectionQuality);
      };
    }
  }, []);
  
  // Periodically check latency to your backend
  useEffect(() => {
    // Only measure latency when online
    if (!isOnline) return;
    
    const checkLatency = async () => {
      try {
        const start = performance.now();
        // Use a lightweight endpoint for ping tests
        await fetch('/api/ping', { 
          method: 'HEAD',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        const end = performance.now();
        setLatency(end - start);
      } catch (error) {
        console.error('Latency check failed:', error);
      }
    };
    
    // Initial check
    checkLatency();
    
    // Check every 30 seconds
    const interval = setInterval(checkLatency, 30000);
    return () => clearInterval(interval);
  }, [isOnline]);
  
  return (
    <NetworkStatusContext.Provider value={{ isOnline, connectionQuality, latency }}>
      {children}
    </NetworkStatusContext.Provider>
  );
}
