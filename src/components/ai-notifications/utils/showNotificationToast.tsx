
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { DynamicAlert } from "../hooks/useAlertData";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

export const showNotificationToast = (
  alert: DynamicAlert, 
  currentUser: Profile
) => {
  // Show notification based on the alert type
  switch(alert.type) {
    case 'discount':
      toast({
        title: alert.title,
        description: alert.message,
        action: (
          <ToastAction 
            altText="View Deal" 
            onClick={() => {
              if (alert.productId) {
                window.location.href = `/product/${alert.productId}`;
              }
            }}
          >
            View Deal
          </ToastAction>
        ),
        duration: 8000,
        priority: 'medium',
        category: 'system'
      });
      break;
      
    case 'trending':
      toast({
        title: alert.title,
        description: alert.message,
        action: (
          <ToastAction 
            altText="See Now" 
            onClick={() => {
              if (alert.productId) {
                window.location.href = `/product/${alert.productId}`;
              }
            }}
          >
            See Now
          </ToastAction>
        ),
        duration: 7000,
        priority: 'medium',
        category: 'system'
      });
      break;
      
    case 'limited-stock':
      toast({
        title: alert.title,
        description: alert.message,
        action: (
          <ToastAction 
            altText="Buy Now" 
            onClick={() => {
              if (alert.productId) {
                window.location.href = `/product/${alert.productId}`;
              }
            }}
          >
            Buy Now
          </ToastAction>
        ),
        duration: 10000,
        priority: 'high',
        category: 'system'
      });
      break;
      
    default:
      toast({
        title: alert.title,
        description: alert.message,
        action: (
          <ToastAction 
            altText="Check it out" 
            onClick={() => {
              if (alert.productId) {
                window.location.href = `/product/${alert.productId}`;
              }
            }}
          >
            Check it out
          </ToastAction>
        ),
        duration: 5000,
        priority: 'low',
        category: 'system'
      });
  }
  
  // Record this notification in the database
  if (currentUser) {
    supabase.from('notifications').insert({
      user_id: currentUser.id,
      message: `${alert.title}: ${alert.message}`,
      read: false,
      type: 'marketplace' // Set the type to marketplace for auto-deletion
    }).then(({ error }) => {
      if (error) {
        console.error('Error saving notification:', error);
      }
    });
  }
};
