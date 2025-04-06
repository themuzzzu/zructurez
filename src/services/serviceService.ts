
import { supabase } from "@/integrations/supabase/client";

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
export const getTrendingServicesInArea = async (areaCode: string): Promise<TrendingService[]> => {
  try {
    // Get trending services from the database, considering optional area filter
    let query = supabase
      .from('services')
      .select('*, profiles:user_id(username,avatar_url)')
      .order('views', { ascending: false })
      .limit(4);
    
    // Apply area filter if provided
    if (areaCode) {
      query = query.eq('area_code', areaCode);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching trending services in area:', error);
      return fallbackTrendingServices;
    }
    
    // If no data returned, use fallback
    if (!data || data.length === 0) {
      return fallbackTrendingServices;
    }
    
    // Format the data to match the TrendingService interface
    const formattedServices = data.map(service => ({
      id: service.id,
      title: service.title || service.name || "Unnamed Service", 
      description: service.description,
      price: service.price,
      image_url: service.image_url || service.banner_url || null,
      user_id: service.user_id,
      provider_name: service.profiles?.username || "Service Provider"
    }));
    
    return formattedServices;
  } catch (err) {
    console.error('Error fetching trending services in area:', err);
    return fallbackTrendingServices;
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
