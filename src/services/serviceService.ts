
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
      service_id_param: serviceId
    });

    if (updateError) throw updateError;

    // Since service_analytics table doesn't exist, we'll just update the views count
    // and return successfully
    return true;
  } catch (error) {
    console.error('Error tracking service view:', error);
    // Don't throw error as this is a non-critical tracking function
    return false;
  }
};

// Track when a user clicks contact on a service
export const trackContactClick = async (serviceId: string) => {
  try {
    // Since we don't have a specific analytics table for this,
    // we'll just log it for now
    console.log(`Contact click tracked for service ${serviceId}`);
    return true;
  } catch (error) {
    console.error('Error tracking contact click:', error);
    // Don't throw error as this is a non-critical tracking function
    return false;
  }
};

// Get trending services in an area
export const getTrendingServicesInArea = async (location?: string, limit: number = 4) => {
  try {
    let query = supabase
      .from('services')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .order('views', { ascending: false })
      .limit(limit);
    
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Map data to a consistent format
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
      rating: 4.5, // Default rating since it doesn't exist on the service
      views: service.views
    }));
  } catch (error) {
    console.error('Error fetching trending services:', error);
    return [];
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
      // This is a simplified example - real recommendation engines would be more complex
      // Just ensure we get different services for logged-in users
      query = query.neq('user_id', userId);
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
      provider_name: "Service Provider", // Default provider name
      category: service.category,
      location: service.location,
      rating: 4.5, // Default rating since it's not in the database
      views: service.views
    }));
  } catch (error) {
    console.error('Error fetching recommended services:', error);
    return [];
  }
};
