
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAlertData } from "./hooks/useAlertData";
import { useNotificationLimiter } from "./hooks/useNotificationLimiter";
import { showNotificationToast } from "./utils/showNotificationToast";

export const SmartNotificationAgent = () => {
  const { data: currentUser } = useCurrentUser();
  const { dynamicAlerts } = useAlertData();
  const { canSendNotification, incrementNotificationCount } = useNotificationLimiter(currentUser?.id);
  
  // Show notifications with daily limit and prioritization
  useEffect(() => {
    if (!dynamicAlerts || dynamicAlerts.length === 0 || !currentUser) return;
    
    const now = new Date();
    
    // Check notification limits
    if (!canSendNotification(now)) {
      return;
    }
    
    // Find the highest priority alert that hasn't expired
    const validAlerts = dynamicAlerts.filter(alert => 
      new Date(alert.expiresAt) > now
    );
    
    if (validAlerts.length > 0) {
      const alert = validAlerts[0];
      
      // Show notification and record it
      showNotificationToast(alert, currentUser);
      
      // Update the notification count tracker
      incrementNotificationCount();
    }
  }, [dynamicAlerts, currentUser, canSendNotification, incrementNotificationCount]);
  
  // This component doesn't render anything visible, it just manages notifications
  return null;
};
