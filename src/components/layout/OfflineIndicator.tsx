
import { useNetworkStatus } from "@/providers/NetworkMonitor";
import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export const OfflineIndicator = () => {
  const { isOnline } = useNetworkStatus();
  const [visible, setVisible] = useState(false);
  
  // Control visibility with a slight delay to prevent flashing
  useEffect(() => {
    if (!isOnline) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isOnline]);
  
  if (isOnline || !visible) return null;
  
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-auto">
      <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">You're offline</span>
        </div>
        <span className="text-xs text-destructive-foreground/80">Using cached data</span>
      </div>
    </div>
  );
};
