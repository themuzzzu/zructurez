
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";

type NetworkStatus = "online" | "offline" | "slow";

interface NetworkContextType {
  status: NetworkStatus;
  lastOnline: Date | null;
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
  status: "online",
  lastOnline: null,
  isOnline: true
});

export const useNetwork = () => useContext(NetworkContext);

interface NetworkMonitorProps {
  children: ReactNode;
}

export const NetworkMonitor = ({ children }: NetworkMonitorProps) => {
  const [status, setStatus] = useState<NetworkStatus>(navigator.onLine ? "online" : "offline");
  const [lastOnline, setLastOnline] = useState<Date | null>(navigator.onLine ? new Date() : null);
  const [connectionQuality, setConnectionQuality] = useState<number>(100);
  const [shouldShowNetworkErrorPopup, setShouldShowNetworkErrorPopup] = useState<boolean>(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setStatus("online");
      setLastOnline(new Date());
      
      // Show a toast notification when network is restored
      if (shouldShowNetworkErrorPopup) {
        toast.success("Your internet connection has been restored!", {
          id: "network-status",
          duration: 3000
        });
        setShouldShowNetworkErrorPopup(false);
      }
    };
    
    const handleOffline = () => {
      setStatus("offline");
      // Show a toast notification when network is lost
      toast.error("You're currently offline. Some features may not work properly.", {
        id: "network-status",
        duration: Infinity
      });
      setShouldShowNetworkErrorPopup(true);
    };
    
    // Check connection quality using the Navigation Timing API
    const checkConnectionQuality = async () => {
      try {
        const start = Date.now();
        
        // Fetch a small resource to test connection speed
        const response = await fetch('/health-check', { 
          method: 'HEAD',
          cache: 'no-store'
        });
        
        const end = Date.now();
        const responseTime = end - start;
        
        // Calculate connection quality based on response time
        // 0-100 scale: 0 = very slow, 100 = very fast
        let quality = 100;
        
        if (responseTime > 1000) {
          quality = 0; // Very slow
          setStatus("slow");
          toast.warning("Your internet connection is slow.", {
            id: "connection-slow",
            duration: 5000
          });
        } else if (responseTime > 500) {
          quality = 50; // Slow
        } else if (responseTime > 200) {
          quality = 75; // Moderate
        }
        
        setConnectionQuality(quality);
      } catch (error) {
        // Error fetching - could mean offline or very slow connection
        console.error("Error checking connection quality:", error);
        if (navigator.onLine) {
          setStatus("slow");
        } else {
          setStatus("offline");
        }
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection quality on initial load
    checkConnectionQuality();
    
    // Check connection quality periodically
    const intervalId = setInterval(checkConnectionQuality, 60000); // Every minute
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [shouldShowNetworkErrorPopup]);
  
  return (
    <NetworkContext.Provider value={{ 
      status, 
      lastOnline,
      isOnline: status !== "offline" 
    }}>
      {children}
    </NetworkContext.Provider>
  );
};
