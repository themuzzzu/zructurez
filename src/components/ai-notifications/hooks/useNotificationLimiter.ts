
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useNotificationLimiter = (userId: string | undefined) => {
  const [lastNotificationTime, setLastNotificationTime] = useState<Date | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const MAX_NOTIFICATIONS = 5; // Limit to 5 notifications per day
  
  // Fetch existing notification count on component mount
  useEffect(() => {
    if (!userId) return;
    
    const fetchNotificationCount = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', today.toISOString()); // Count only today's notifications
        
      if (!error && count !== null) {
        setNotificationCount(count);
        console.log(`User already has ${count} notifications today`);
      }
    };
    
    fetchNotificationCount();
  }, [userId]);

  const canSendNotification = (now: Date) => {
    const minTimeBetweenNotifications = 2 * 60 * 60 * 1000; // 2 hours between notifications
    
    // Check if we've reached the maximum notifications for today or if enough time has passed
    if (
      notificationCount >= MAX_NOTIFICATIONS ||
      (lastNotificationTime !== null && 
        now.getTime() - lastNotificationTime.getTime() <= minTimeBetweenNotifications)
    ) {
      console.log(`Skipping notification: count=${notificationCount}, max=${MAX_NOTIFICATIONS}, timeCheck=${lastNotificationTime ? 'true' : 'false'}`);
      return false;
    }
    
    return true;
  };

  const incrementNotificationCount = () => {
    setLastNotificationTime(new Date());
    setNotificationCount(prev => prev + 1);
    console.log(`Sending notification #${notificationCount + 1} for today`);
  };

  return {
    notificationCount,
    canSendNotification,
    incrementNotificationCount
  };
};
