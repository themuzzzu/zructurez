
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Type for city data
export interface City {
  id: number;
  city_name: string;
  district: string;
  region: string;
  is_available: boolean;
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
      .select("*")
      .eq("city_name", cityName)
      .single();
      
    if (cityError || !cityData) {
      toast.error("This city is not supported in Zructures");
      return false;
    }
    
    // If city exists, check if it's available
    if (!cityData.is_available) {
      toast.info(`Zructures is not yet available in ${cityName}. Stay tuned!`);
      return false;
    }
    
    // If city is available, update localStorage
    localStorage.setItem("userLocation", cityName);
    
    // Dispatch custom event for other components
    window.dispatchEvent(
      new CustomEvent("locationUpdated", { 
        detail: { location: cityName, isAvailable: true } 
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
    // Use OpenStreetMap's Nominatim service for reverse geocoding
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
    const dbCities = await fetchAllCities();
    const dbCityNames = dbCities.map(city => city.city_name.toLowerCase());
    
    // Check if any of the potential cities match our database cities
    for (const city of potentialCities) {
      if (dbCityNames.includes(city.toLowerCase())) {
        return city;
      }
    }
    
    // If no exact match, try to find the closest match
    // For now, return null as we couldn't find a match
    return null;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    return null;
  }
};
