
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define City interface for better type safety
export interface City {
  id: number;
  city_name: string;
  district: string;
  is_available: boolean;
  latitude?: number;
  longitude?: number;
}

// Default city to show when no specific city is selected
export const DEFAULT_CITY = "All India";

// Check if a city is available in the Zructures service area
export const checkCityAvailability = async (cityName: string): Promise<boolean> => {
  // If no city selected or it's the default city, consider it available
  if (!cityName || cityName === DEFAULT_CITY) {
    return true;
  }

  // Hardcoded available city (fallback when DB check fails)
  const hardcodedAvailableCities = ["Tadipatri"];
  const cityPart = cityName.split(',')[0].trim(); // Extract city name before any comma

  // First check hardcoded list for immediate response and fallback
  if (hardcodedAvailableCities.some(city => 
    cityPart.toLowerCase() === city.toLowerCase() || 
    cityPart.toLowerCase().includes(city.toLowerCase())
  )) {
    return true;
  }
  
  try {
    // Try to fetch from database
    const { data, error } = await supabase
      .from('city_availability')
      .select('is_available')
      .eq('city_name', cityPart)
      .single();
    
    if (error) {
      console.error("Error checking city availability:", error);
      // Fallback to hardcoded check
      return hardcodedAvailableCities.includes(cityPart);
    }
    
    return data?.is_available || false;
  } catch (error) {
    console.error("Error checking city availability:", error);
    // Fallback to hardcoded check on exception
    return hardcodedAvailableCities.includes(cityPart);
  }
};
