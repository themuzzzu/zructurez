
import { supabase } from "@/integrations/supabase/client";

// Define an interface for service data
export interface Service {
  id: string;
  title: string;
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  banner_url?: string;
  user_id?: string;
  provider_name?: string;
  category?: string;
  location?: string;
  views?: number;
  rating?: number;
  is_open?: boolean;
}

// Interface for trending service data
interface TrendingService {
  id: string;
  title: string;
  description?: string;
  price?: number;
  image_url?: string;
  user_id?: string;
  provider_name?: string;
}

// Add missing functions for service tracking
export const trackServiceView = async (serviceId: string): Promise<boolean> => {
  try {
    await incrementServiceViews(serviceId);
    return true;
  } catch (error) {
    console.error('Error tracking service view:', error);
    return false;
  }
};

export const trackContactClick = async (serviceId: string): Promise<boolean> => {
  try {
    // In a real implementation, this would call an API to record the contact click
    console.log(`Contact click recorded for service ${serviceId}`);
    return true;
  } catch (error) {
    console.error('Error tracking contact click:', error);
    return false;
  }
};

// Function to get recommended services
export const getRecommendedServices = async (
  userId?: string,
  limit: number = 4
): Promise<Service[]> => {
  try {
    // In a real app, use the userId to get personalized recommendations
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recommended services:', error);
    return fallbackTrendingServices.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description || "",
      price: service.price || 0,
      image_url: service.image_url,
      user_id: service.user_id,
      provider_name: service.provider_name
    }));
  }
};

// Helper function to increment service views
const incrementServiceViews = async (serviceId: string): Promise<void> => {
  try {
    await supabase.rpc('increment_service_views', { service_id_param: serviceId });
  } catch (error) {
    console.error('Error incrementing service views:', error);
    throw error;
  }
};

// Fallback trending services data
const fallbackTrendingServices: TrendingService[] = [
  {
    id: "trending-1",
    title: "Home Cleaning Service",
    description: "Professional house cleaning services",
    price: 1800,
    image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80", 
    user_id: "provider-1",
    provider_name: "CleanCo"
  },
  {
    id: "trending-2",
    title: "Web Development",
    description: "Professional website design and development",
    price: 20000,
    image_url: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=300&q=80",
    user_id: "provider-2",
    provider_name: "TechSolutions"
  },
  {
    id: "trending-3",
    title: "Personal Trainer",
    description: "Custom fitness programs and personal training",
    price: 3000,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=300&q=80",
    user_id: "provider-3",
    provider_name: "FitLife"
  },
  {
    id: "trending-4",
    title: "Digital Marketing",
    description: "Boost your online presence with our marketing services",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80",
    user_id: "provider-4",
    provider_name: "GrowthHackers"
  }
];

/**
 * Fetch trending services in a specific area
 * @param areaCode Geographic area code (optional)
 * @returns Array of trending services
 */
export const getTrendingServicesInArea = async (areaCode: string): Promise<Service[]> => {
  try {
    // Get trending services from the database, considering optional area filter
    let query = supabase
      .from('services')
      .select('*')
      .order('views', { ascending: false })
      .limit(4);
    
    // Apply area filter if provided
    if (areaCode) {
      query = query.eq('area_code', areaCode);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching trending services in area:', error);
      return fallbackTrendingServices.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description || "",
        price: service.price || 0,
        image_url: service.image_url,
        user_id: service.user_id,
        provider_name: service.provider_name
      }));
    }
    
    // If no data returned, use fallback
    if (!data || data.length === 0) {
      return fallbackTrendingServices.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description || "",
        price: service.price || 0,
        image_url: service.image_url,
        user_id: service.user_id,
        provider_name: service.provider_name
      }));
    }
    
    // Format the data to match the Service interface
    return data.map(service => ({
      id: service.id,
      title: service.title || "Unnamed Service", 
      description: service.description,
      price: service.price,
      image_url: service.image_url || null,
      user_id: service.user_id,
      provider_name: "Service Provider"
    }));
  } catch (err) {
    console.error('Error fetching trending services in area:', err);
    return fallbackTrendingServices.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description || "",
      price: service.price || 0,
      image_url: service.image_url,
      user_id: service.user_id,
      provider_name: service.provider_name
    }));
  }
};

/**
 * Get a service by its ID
 * @param serviceId Service ID to fetch
 * @returns Service data with its portfolio and products
 */
export const getServiceById = async (serviceId: string) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_portfolio(*),
        service_products(*,service_product_images(*))
      `)
      .eq('id', serviceId)
      .single();
    
    if (error) {
      console.error(`Error fetching service ${serviceId}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in getServiceById for ${serviceId}:`, error);
    throw error;
  }
};
