
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
  const toastOptions = {
    title: alert.title,
    description: alert.message,
    action: (
      <ToastAction 
        altText="View" 
        onClick={() => {
          if (alert.productId) {
            window.location.href = `/product/${alert.productId}`;
          }
        }}
      >
        View
      </ToastAction>
    ),
    duration: 7000
  };
  
  toast(toastOptions);
  
  // Record this notification in the database
  if (currentUser) {
    supabase.from('notifications').insert({
      user_id: currentUser.id,
      message: `${alert.title}: ${alert.message}`,
      read: false,
      type: 'marketplace' // Set the type to marketplace for auto-deletion
    });
  }
};
