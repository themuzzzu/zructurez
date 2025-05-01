
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface NetworkMonitorContextValue {
  isOnline: boolean;
}

const NetworkMonitorContext = createContext<NetworkMonitorContextValue>({ isOnline: true });

export const useNetworkMonitor = () => useContext(NetworkMonitorContext);

export const NetworkMonitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline. Some features may be limited.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <NetworkMonitorContext.Provider value={{ isOnline }}>
      {children}
    </NetworkMonitorContext.Provider>
  );
};
