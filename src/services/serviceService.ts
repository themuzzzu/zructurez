
import { supabase } from "@/integrations/supabase/client";

// Helper function to simplify error handling
const handleApiError = (error: any, message: string) => {
  console.error(message, error);
  throw new Error(message);
};

// Track when a service is viewed
export const trackServiceView = async (serviceId: string) => {
  try {
    // First, increment the views counter in the services table
    const { error: updateError } = await supabase.rpc('increment_service_views', {
      service_id: serviceId
    });

    if (updateError) throw updateError;

    // Also record an analytics entry for more detailed tracking
    const { error: analyticsError } = await supabase
      .from('service_analytics')
      .insert({
        service_id: serviceId,
        event_type: 'view',
        timestamp: new Date().toISOString()
      });

    if (analyticsError) throw analyticsError;
  } catch (error) {
    console.error('Error tracking service view:', error);
    // Don't throw error as this is a non-critical tracking function
  }
};

// Track when a user clicks contact on a service
export const trackContactClick = async (serviceId: string) => {
  try {
    const { error } = await supabase
      .from('service_analytics')
      .insert({
        service_id: serviceId,
        event_type: 'contact_click',
        timestamp: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking contact click:', error);
    // Don't throw error as this is a non-critical tracking function
  }
};

// Get recommended services based on a variety of factors
export const getRecommendedServices = async (userId?: string, limit: number = 4) => {
  try {
    // Basic query to get services
    let query = supabase
      .from('services')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .limit(limit);

    // If user is logged in, we could personalize recommendations
    if (userId) {
      // Example: Filter by services the user hasn't viewed yet
      // This is a simplified example - real recommendation engines would be more complex
      const { data: viewedServices } = await supabase
        .from('service_analytics')
        .select('service_id')
        .eq('user_id', userId)
        .eq('event_type', 'view');

      if (viewedServices && viewedServices.length > 0) {
        const viewedIds = viewedServices.map(item => item.service_id);
        query = query.not('id', 'in', `(${viewedIds.join(',')})`);
      }
    }

    // Order by views as a simple proxy for popularity
    query = query.order('views', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    // Map data to consistent format
    return (data || []).map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      image_url: service.image_url,
      price: service.price,
      user_id: service.user_id,
      provider_name: service.profiles?.username || "Service Provider",
      category: service.category,
      location: service.location,
      rating: service.rating || 4.5,
      views: service.views
    }));
  } catch (error) {
    console.error('Error fetching recommended services:', error);
    return [];
  }
};
