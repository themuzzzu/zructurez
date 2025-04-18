
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";

type NetworkStatus = "online" | "offline" | "slow";

interface NetworkContextType {
  status: NetworkStatus;
  lastOnline: Date | null;
  isOnline: boolean;
  connectionQuality: number;
}

const NetworkContext = createContext<NetworkContextType>({
  status: "online",
  lastOnline: null,
  isOnline: true,
  connectionQuality: 100
});

export const useNetworkStatus = () => useContext(NetworkContext);

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
        // Skip the connection quality check to avoid unnecessary warnings
        return;
      } catch (error) {
        // Error fetching - could mean offline or very slow connection
        console.error("Error checking connection quality:", error);
        if (navigator.onLine) {
          // Don't set status to slow to avoid unnecessary warnings
        } else {
          setStatus("offline");
        }
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection quality on initial load - but don't show slow connection warnings
    checkConnectionQuality();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [shouldShowNetworkErrorPopup]);
  
  return (
    <NetworkContext.Provider value={{ 
      status, 
      lastOnline,
      isOnline: status !== "offline",
      connectionQuality
    }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = useNetworkStatus;
