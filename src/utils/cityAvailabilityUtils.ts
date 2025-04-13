import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Type for city data
export interface City {
  id: number;
  city_name: string;
  district: string;
  region: string;
  is_available: boolean;
  latitude?: number;
  longitude?: number;
}

// Default city when no selection is made
export const DEFAULT_CITY = "Tadipatri";

// Fetch all cities from the database
export const fetchAllCities = async (): Promise<City[]> => {
  try {
    const { data, error } = await supabase
      .from("city_availability")
      .select("*")
      .order("district", { ascending: true })
      .order("city_name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

// Fetch available cities only
export const fetchAvailableCities = async (): Promise<City[]> => {
  try {
    const { data, error } = await supabase
      .from("city_availability")
      .select("*")
      .eq("is_available", true)
      .order("city_name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching available cities:", error);
    return [];
  }
};

// Check if a city is available
export const checkCityAvailability = async (cityName: string): Promise<boolean> => {
  if (!cityName) return false;
  
  try {
    const { data, error } = await supabase
      .from("city_availability")
      .select("is_available")
      .eq("city_name", cityName)
      .single();
    
    if (error) {
      console.error("Error checking city availability:", error);
      return false;
    }
    
    return data?.is_available || false;
  } catch (error) {
    console.error("Error checking city availability:", error);
    return false;
  }
};

// Handle city selection and availability checking
export const handleCitySelection = async (cityName: string): Promise<boolean> => {
  try {
    // First check if city exists in our database
    const { data: cityData, error: cityError } = await supabase
      .from("city_availability")
      .select("*, latitude, longitude")
      .eq("city_name", cityName)
      .single();
      
    if (cityError || !cityData) {
      toast.error("This city is not supported in Zructures");
      return false;
    }
    
    // If city exists, check if it's available
    if (!cityData.is_available) {
      toast.info(`Zructures is not yet available in ${cityName}. Stay tuned!`);
      
      // Update location anyway but inform user of limited functionality
      localStorage.setItem("userLocation", cityName);
      
      // Dispatch custom event for other components
      window.dispatchEvent(
        new CustomEvent("locationUpdated", { 
          detail: { 
            location: cityName, 
            isAvailable: false,
            latitude: cityData.latitude,
            longitude: cityData.longitude
          } 
        })
      );
      
      return true;
    }
    
    // If city is available, update localStorage
    localStorage.setItem("userLocation", cityName);
    
    // Dispatch custom event for other components
    window.dispatchEvent(
      new CustomEvent("locationUpdated", { 
        detail: { 
          location: cityName, 
          isAvailable: true,
          latitude: cityData.latitude,
          longitude: cityData.longitude
        } 
      })
    );
    
    toast.success(`Location updated to ${cityName}`);
    return true;
    
  } catch (error) {
    console.error("Error handling city selection:", error);
    toast.error("Could not update location. Please try again.");
    return false;
  }
};

// Update the isZructuresAvailable function to use our city_availability table
export const isZructuresAvailable = async (location: string): Promise<boolean> => {
  if (!location || location === "All India") return false;
  
  // Clean the location string to match city names in our database
  const cityName = location.includes(" - ") 
    ? location.split(" - ")[0] 
    : location;
  
  return await checkCityAvailability(cityName);
};

// Get a list of cities by district
export const getCitiesByDistrict = async (): Promise<Record<string, City[]>> => {
  const cities = await fetchAllCities();
  
  return cities.reduce((acc: Record<string, City[]>, city) => {
    if (!acc[city.district]) {
      acc[city.district] = [];
    }
    acc[city.district].push(city);
    return acc;
  }, {});
};

// Reverse geocode to find the nearest city in our database
export const findNearestCity = async (
  latitude: number, 
  longitude: number
): Promise<string | null> => {
  try {
    // First try to use Nominatim for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error("Failed to reverse geocode");
    }
    
    const data = await response.json();
    const address = data.address;
    
    // Extract potential city names from the response
    const potentialCities = [
      address.city,
      address.town,
      address.village,
      address.hamlet,
      address.suburb
    ].filter(Boolean);
    
    // Get all cities from our database
    const { data: dbCities, error } = await supabase
      .from("city_availability")
      .select("*, latitude, longitude");
      
    if (error || !dbCities) {
      console.error("Error fetching cities:", error);
      return null;
    }
    
    // Check for exact matches first
    for (const city of potentialCities) {
      const match = dbCities.find(
        dbCity => dbCity.city_name.toLowerCase() === city.toLowerCase()
      );
      if (match) return match.city_name;
    }
    
    // If no exact match, find the nearest city using coordinates
    // This requires latitude and longitude fields in the city_availability table
    const citiesWithCoordinates = dbCities.filter(
      city => typeof city.latitude === 'number' && typeof city.longitude === 'number'
    );
    
    if (citiesWithCoordinates.length > 0) {
      // Calculate distance to each city
      const distances = citiesWithCoordinates.map(city => {
        const distance = getDistanceBetweenCoordinates(
          latitude, 
          longitude, 
          city.latitude!, 
          city.longitude!
        );
        return { city: city.city_name, distance };
      });
      
      // Sort by distance
      distances.sort((a, b) => a.distance - b.distance);
      
      // Return the closest city if within 50km
      if (distances[0].distance < 50) {
        return distances[0].city;
      }
    }
    
    // If no match found, return null
    return null;
  } catch (error) {
    console.error("Error in findNearestCity:", error);
    return null;
  }
};

// Calculate distance between two points using Haversine formula
function getDistanceBetweenCoordinates(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  // Earth's radius in kilometers
  const R = 6371;
  
  const deg2rad = (deg: number) => deg * (Math.PI/180);
  
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
}
