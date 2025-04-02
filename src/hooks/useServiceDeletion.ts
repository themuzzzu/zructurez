
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useServiceDeletion = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteService = async (serviceId: string) => {
    if (!serviceId) return;
    
    setIsDeleting(true);
    try {
      // Use the SQL function we created to safely delete service
      const { data, error } = await supabase
        .rpc('delete_service_safely', { 
          service_id_param: serviceId
        });

      if (error) throw error;
      
      if (data === true) {
        toast.success("Service deleted successfully");
        onSuccess?.();
        return true;
      } else {
        toast.warning("This service has active appointments and cannot be deleted");
        return false;
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service. Please try again.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteService
  };
};
