
import { supabase } from "@/integrations/supabase/client";

interface CreateServiceData {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  image: string | null;
  contactInfo: string;
  availability: string;
  timestamp: string;
}

export const createService = async (serviceData: CreateServiceData) => {
  const response = await fetch('https://api.example.com/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error('Failed to create service');
  }

  return response.json();
};

export const getServices = async () => {
  const response = await fetch('https://api.example.com/services');
  
  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }

  return response.json();
};

// Service Analytics Functions
export const trackServiceView = async (serviceId: string) => {
  try {
    const { data, error } = await supabase.rpc('increment_service_views', {
      service_id_param: serviceId
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error tracking service view:', error);
    // Fallback to local tracking if RPC fails
    return incrementLocalServiceStat(serviceId, 'views');
  }
};

export const trackServiceBooking = async (serviceId: string) => {
  try {
    const { data, error } = await supabase.rpc('increment_service_bookings', {
      service_id_param: serviceId
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error tracking service booking:', error);
    // Fallback to local tracking if RPC fails
    return incrementLocalServiceStat(serviceId, 'bookings');
  }
};

export const trackContactClick = async (serviceId: string) => {
  try {
    const { data, error } = await supabase
      .from('service_analytics')
      .upsert({ 
        service_id: serviceId, 
        contact_clicks: 1,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'service_id',
        ignoreDuplicates: false
      });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error tracking contact click:', error);
    // Use local storage as fallback
    return incrementLocalServiceStat(serviceId, 'contact_clicks');
  }
};

// Local fallback tracking when database operations fail
const incrementLocalServiceStat = (serviceId: string, statType: 'views' | 'bookings' | 'contact_clicks') => {
  const storageKey = `service_analytics_${serviceId}`;
  let analytics = JSON.parse(localStorage.getItem(storageKey) || '{}');
  
  if (!analytics[statType]) {
    analytics[statType] = 0;
  }
  
  analytics[statType]++;
  analytics.last_updated = new Date().toISOString();
  localStorage.setItem(storageKey, JSON.stringify(analytics));
  
  return analytics;
};

// Fetch service analytics
export const getServiceAnalytics = async (serviceId: string) => {
  try {
    // First try to get analytics from the database
    const { data, error } = await supabase
      .from('service_analytics')
      .select('*')
      .eq('service_id', serviceId)
      .single();
    
    if (error) throw error;
    
    // Also get the service view/booking counts
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('views, bookings_count')
      .eq('id', serviceId)
      .single();
    
    if (serviceError) throw serviceError;
    
    return {
      ...data,
      views: serviceData.views || 0,
      bookings: serviceData.bookings_count || 0
    };
  } catch (error) {
    console.error('Error fetching service analytics:', error);
    
    // Use local storage as fallback
    const storageKey = `service_analytics_${serviceId}`;
    const localAnalytics = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    return {
      service_id: serviceId,
      views: localAnalytics.views || 0,
      bookings: localAnalytics.bookings || 0,
      contact_clicks: localAnalytics.contact_clicks || 0,
      last_updated: localAnalytics.last_updated || new Date().toISOString()
    };
  }
};

// Get all analytics for a user's services
export const getUserServiceAnalytics = async (userId: string) => {
  try {
    // First get all services owned by this user
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, title, views, bookings_count')
      .eq('user_id', userId);
      
    if (servicesError) throw servicesError;
    
    // Then get analytics for each service
    const servicesWithAnalytics = await Promise.all(
      services.map(async (service) => {
        try {
          const { data, error } = await supabase
            .from('service_analytics')
            .select('*')
            .eq('service_id', service.id)
            .maybeSingle();
          
          return {
            ...service,
            analytics: data || {
              views: service.views || 0,
              bookings: service.bookings_count || 0,
              contact_clicks: 0
            }
          };
        } catch (error) {
          console.error(`Error fetching analytics for service ${service.id}:`, error);
          return {
            ...service,
            analytics: {
              views: service.views || 0,
              bookings: service.bookings_count || 0,
              contact_clicks: 0
            }
          };
        }
      })
    );
    
    return servicesWithAnalytics;
  } catch (error) {
    console.error('Error fetching user service analytics:', error);
    return [];
  }
};

// Service Recommendation Functions

// Update user preferences
export const updateUserPreferences = async (userId: string, preferences: {
  categories?: string[],
  locations?: string[],
  priceRange?: { min: number, max: number }
}) => {
  try {
    // Get the current preferences first
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('service_preferences')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    // Merge with existing preferences
    const currentPreferences = userData.service_preferences || {};
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences
    };
    
    // Update the user's preferences
    const { error } = await supabase
      .from('profiles')
      .update({ service_preferences: updatedPreferences })
      .eq('id', userId);
    
    if (error) throw error;
    
    return updatedPreferences;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    // Fallback to local storage
    const storageKey = `user_service_preferences_${userId}`;
    const currentPreferences = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences
    };
    localStorage.setItem(storageKey, JSON.stringify(updatedPreferences));
    return updatedPreferences;
  }
};

// Get user preferences
export const getUserPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('service_preferences')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data.service_preferences || {
      categories: [],
      locations: [],
      priceRange: null
    };
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    // Fallback to local storage
    const storageKey = `user_service_preferences_${userId}`;
    return JSON.parse(localStorage.getItem(storageKey) || '{}');
  }
};

// Get personalized service recommendations
export const getRecommendedServices = async (userId: string) => {
  try {
    // Get user preferences first
    const preferences = await getUserPreferences(userId);
    
    // Build the query based on preferences
    let query = supabase
      .from('services')
      .select(`
        *,
        profiles:profiles(username, avatar_url)
      `)
      .order('views', { ascending: false })
      .limit(10);
    
    // Apply category filter if present
    if (preferences.categories && preferences.categories.length > 0) {
      query = query.in('category', preferences.categories);
    }
    
    // Apply location filter if present
    if (preferences.locations && preferences.locations.length > 0) {
      query = query.in('location', preferences.locations);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Further filter by price range on the client-side if needed
    let filteredData = data;
    if (preferences.priceRange && preferences.priceRange.min !== undefined && preferences.priceRange.max !== undefined) {
      filteredData = data.filter(service => 
        service.price >= preferences.priceRange.min && 
        service.price <= preferences.priceRange.max
      );
    }
    
    return filteredData;
  } catch (error) {
    console.error('Error fetching recommended services:', error);
    return [];
  }
};

// Get trending services in user's area
export const getTrendingServicesInArea = async (location: string, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        profiles:profiles(username, avatar_url)
      `)
      .ilike('location', `%${location}%`)
      .order('views', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching trending services:', error);
    return [];
  }
};

// Get trending service categories
export const getTrendingCategories = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('category, count')
      .order('count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching trending categories:', error);
    // Fallback - return some common categories
    return [
      { category: 'Home Services', count: 120 },
      { category: 'Professional Services', count: 95 },
      { category: 'Personal Care', count: 85 },
      { category: 'Education', count: 70 },
      { category: 'Events', count: 55 }
    ];
  }
};
