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

// Hardcoded available cities for immediate response and fallback
export const AVAILABLE_CITIES = ["Tadipatri", "Anantapur", "Tadpatri"];

// Check if a city is available in the Zructures service area
export const checkCityAvailability = async (cityName: string): Promise<boolean> => {
  // If no city selected or it's the default city, consider it available
  if (!cityName || cityName === DEFAULT_CITY) {
    return true;
  }

  // Extract city name before any comma to handle "City, District" format
  const cityPart = cityName.split(',')[0].trim();

  // Special case for Tadipatri area identifiers
  if (cityName.toLowerCase().includes('tadipatri') ||
      cityName.toLowerCase().includes('tadpatri') ||
      cityName.toLowerCase().includes('nh67') ||
      cityName.toLowerCase().includes('nh544')) {
    return true;
  }

  // First check hardcoded list for immediate response and fallback
  if (AVAILABLE_CITIES.some(city => 
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
      // Additional check for Tadipatri area
      if (cityPart.toLowerCase().includes('tadipatri') ||
          cityPart.toLowerCase().includes('tadpatri') ||
          cityPart.toLowerCase().includes('anantapur')) {
        return true;
      }
      // Fallback to hardcoded check
      return AVAILABLE_CITIES.some(city => 
        cityPart.toLowerCase() === city.toLowerCase() || 
        cityPart.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    return data?.is_available || false;
  } catch (error) {
    console.error("Error checking city availability:", error);
    // Fallback to hardcoded check on exception
    return AVAILABLE_CITIES.some(city => 
      cityPart.toLowerCase() === city.toLowerCase() || 
      cityPart.toLowerCase().includes(city.toLowerCase())
    );
  }
};

// Function to improve location accuracy by normalizing city names
export const normalizeLocationName = (location: string): string => {
  const cityPart = location.split(',')[0].trim().toLowerCase();
  
  // Map common mistaken locations to their correct version
  const cityMappings: Record<string, string> = {
    "vizag": "Visakhapatnam",
    "vizianagaram": "Vizianagaram",
    "tadipatri": "Tadipatri",
    "tadpatri": "Tadipatri", // Normalize alternative spelling
    "anantapur": "Anantapur", 
    "dharmavaram": "Dharmavaram",
    "kadapa": "Kadapa",
    "kurnool": "Kurnool"
  };
  
  // Special case for NH roads in Tadipatri
  if (cityPart.includes('nh67') || cityPart.includes('nh544')) {
    return "Tadipatri";
  }
  
  // Check if the location matches any of our known locations
  for (const [key, value] of Object.entries(cityMappings)) {
    if (cityPart.includes(key)) {
      return value;
    }
  }
  
  // If no match found, return the original city part with first letter capitalized
  return cityPart.charAt(0).toUpperCase() + cityPart.slice(1);
};

// Function to find the nearest available city based on coordinates
export const findNearestAvailableCity = async (
  latitude: number, 
  longitude: number
): Promise<string> => {
  try {
    // Get all available cities with coordinates
    const { data, error } = await supabase
      .from('city_availability')
      .select('city_name, latitude, longitude, is_available')
      .filter('latitude', 'is not', null)
      .filter('longitude', 'is not', null);
      
    if (error || !data || data.length === 0) {
      throw new Error('Failed to fetch cities with coordinates');
    }
    
    // Calculate distances and find the nearest available city
    let nearestCity = "";
    let minDistance = Number.MAX_VALUE;
    
    data.forEach(city => {
      if (!city.latitude || !city.longitude) return;
      
      const distance = calculateDistance(
        latitude, longitude, 
        city.latitude, city.longitude
      );
      
      // Update nearest city if this one is closer
      if (distance < minDistance && city.is_available) {
        minDistance = distance;
        nearestCity = city.city_name;
      }
    });
    
    if (nearestCity) {
      return nearestCity;
    }
    
    // Fallback to first available city in our list if no nearest found
    return AVAILABLE_CITIES[0];
  } catch (error) {
    console.error("Error finding nearest available city:", error);
    return AVAILABLE_CITIES[0];
  }
};

// Calculate distance between two points using Haversine formula (in km)
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  // Radius of the Earth in kilometers
  const R = 6371;
  
  // Convert degrees to radians
  const deg2rad = (deg: number) => deg * (Math.PI / 180);
  
  // Calculate differences
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  // Haversine formula calculation
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Distance in kilometers
  return R * c;
};
