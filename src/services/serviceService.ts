
import { supabase } from "@/integrations/supabase/client";
import { trackEntityView } from "@/utils/viewsTracking";

/**
 * Tracks a view for a service
 * @param serviceId The ID of the service
 */
export const trackServiceView = async (serviceId: string): Promise<void> => {
  if (!serviceId) return;
  await trackEntityView('service', serviceId);
};

/**
 * Tracks when a user clicks the contact/call button
 * @param serviceId The ID of the service
 */
export const trackContactClick = async (serviceId: string): Promise<void> => {
  if (!serviceId) return;
  
  try {
    // Record the click in the search_result_clicks table
    await supabase.rpc('record_search_result_click', {
      user_id_param: (await supabase.auth.getUser()).data.user?.id || null,
      query_param: 'direct_call',
      result_id_param: serviceId,
      is_sponsored_param: false
    });
  } catch (error) {
    console.error('Error tracking contact click:', error);
  }
};
