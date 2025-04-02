
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

/**
 * Get recommended services for a user
 * @param userId The user ID to get recommendations for
 * @returns Array of recommended services
 */
export const getRecommendedServices = async (userId: string) => {
  try {
    // This is a simplified implementation that could be enhanced with real recommendations logic
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .order('views', { ascending: false })
      .limit(4);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recommended services:', error);
    return [];
  }
};

/**
 * Get trending services in a specific area
 * @param location The location to get trending services for
 * @returns Array of trending services in the area
 */
export const getTrendingServicesInArea = async (location: string) => {
  try {
    // Filter by location if provided, otherwise get general trending services
    const query = supabase
      .from('services')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .order('views', { ascending: false })
      .limit(4);
      
    if (location) {
      query.ilike('location', `%${location}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching trending services in area:', error);
    return [];
  }
};
