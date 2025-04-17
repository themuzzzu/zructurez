
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NetworkContextType {
  isOnline: boolean;
  connectionQuality?: 'good' | 'poor' | 'offline';
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkMonitor = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>(
    navigator.onLine ? 'good' : 'offline'
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionQuality('good');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionQuality('offline');
    };

    // Check connection quality if supported
    const checkConnectionQuality = () => {
      if ('connection' in navigator && navigator.connection) {
        const connection = (navigator as any).connection;
        if (connection.effectiveType === '2g' || connection.downlink < 0.5) {
          setConnectionQuality('poor');
        } else {
          setConnectionQuality('good');
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Add connection change listener if available
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', checkConnectionQuality);
    }

    // Initial check
    checkConnectionQuality();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', checkConnectionQuality);
      }
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline, connectionQuality }}>
      {children}
    </NetworkContext.Provider>
  );
};

// Export both names for compatibility
export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

// Add the useNetworkStatus function that's being imported elsewhere
export const useNetworkStatus = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetworkStatus must be used within a NetworkProvider');
  }
  return context;
};
