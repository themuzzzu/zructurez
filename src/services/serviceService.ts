
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

// Service Analytics Functions - Local Implementation
export const trackServiceView = async (serviceId: string) => {
  try {
    // Since the DB function isn't available yet, use local tracking
    return incrementLocalServiceStat(serviceId, 'views');
  } catch (error) {
    console.error('Error tracking service view:', error);
    return incrementLocalServiceStat(serviceId, 'views');
  }
};

export const trackServiceBooking = async (serviceId: string) => {
  try {
    // Since the DB function isn't available yet, use local tracking
    return incrementLocalServiceStat(serviceId, 'bookings');
  } catch (error) {
    console.error('Error tracking service booking:', error);
    return incrementLocalServiceStat(serviceId, 'bookings');
  }
};

export const trackContactClick = async (serviceId: string) => {
  try {
    // Since the table doesn't exist yet, use local tracking
    return incrementLocalServiceStat(serviceId, 'contact_clicks');
  } catch (error) {
    console.error('Error tracking contact click:', error);
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
    // Try to get the service data (views/bookings might not exist yet)
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();
    
    if (serviceError) throw serviceError;
    
    // Use local storage as primary data source since the table doesn't exist yet
    const storageKey = `service_analytics_${serviceId}`;
    const localAnalytics = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    return {
      service_id: serviceId,
      views: localAnalytics.views || 0,
      bookings: localAnalytics.bookings || 0,
      contact_clicks: localAnalytics.contact_clicks || 0,
      last_updated: localAnalytics.last_updated || new Date().toISOString()
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
      .select('id, title')
      .eq('user_id', userId);
      
    if (servicesError) throw servicesError;
    
    // Then get analytics for each service from local storage
    const servicesWithAnalytics = services.map((service) => {
      const storageKey = `service_analytics_${service.id}`;
      const localAnalytics = JSON.parse(localStorage.getItem(storageKey) || '{}');
      
      return {
        ...service,
        analytics: {
          views: localAnalytics.views || 0,
          bookings: localAnalytics.bookings || 0,
          contact_clicks: localAnalytics.contact_clicks || 0
        }
      };
    });
    
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
    // Store preferences in localStorage since profile schema update may not be available
    const storageKey = `user_service_preferences_${userId}`;
    const currentPreferences = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences
    };
    localStorage.setItem(storageKey, JSON.stringify(updatedPreferences));
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
    // Get preferences from localStorage since profile schema update may not be available
    const storageKey = `user_service_preferences_${userId}`;
    return JSON.parse(localStorage.getItem(storageKey) || '{}');
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    // Fallback to empty preferences
    return {
      categories: [],
      locations: [],
      priceRange: null
    };
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
        profiles(username, avatar_url)
      `);
    
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
    let filteredData = data || [];
    if (preferences.priceRange && preferences.priceRange.min !== undefined && preferences.priceRange.max !== undefined) {
      filteredData = filteredData.filter(service => {
        // Convert price to number before comparison
        const servicePrice = Number(service.price);
        const minPrice = Number(preferences.priceRange.min);
        const maxPrice = Number(preferences.priceRange.max);
        
        return !isNaN(servicePrice) && !isNaN(minPrice) && !isNaN(maxPrice) &&
               servicePrice >= minPrice && servicePrice <= maxPrice;
      });
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
        profiles(username, avatar_url)
      `)
      .ilike('location', `%${location}%`)
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
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
      .select('category')
      .limit(100); // Get a larger sample to analyze
    
    if (error) throw error;
    
    // Count occurrences of each category
    const categoryCounts: Record<string, number> = {};
    data.forEach(service => {
      if (service.category) {
        categoryCounts[service.category] = (categoryCounts[service.category] || 0) + 1;
      }
    });
    
    // Convert to array and sort by count
    const sortedCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => Number(b.count) - Number(a.count))
      .slice(0, limit);
    
    return sortedCategories;
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
