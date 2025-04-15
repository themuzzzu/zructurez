
import { toast } from "sonner";

// List of cities where Zructures is available
// This could be fetched from an API/database in a real implementation
export const availableCities = [
  "Tadipatri",
  // Other cities will be marked as not available
];

// Check if Zructures is available in a given city
export const isZructuresAvailable = (location: string): boolean => {
  if (!location) return false;
  
  // Extract city name from the location string (could be "City - Area" format)
  const cityPart = location.includes(" - ") 
    ? location.split(" - ")[0] 
    : location.includes(", ") 
      ? location.split(", ")[0]
      : location;
  
  // Check if the city is in our list of available cities
  return availableCities.some(city => 
    cityPart.toLowerCase() === city.toLowerCase() || 
    cityPart.toLowerCase().includes(city.toLowerCase()) ||
    city.toLowerCase().includes(cityPart.toLowerCase())
  );
};

// Get user's current location using browser's Geolocation API with high accuracy
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        reject(error);
      },
      { 
        enableHighAccuracy: true, // Force the use of GPS for maximum precision
        timeout: 20000,           // Increased timeout for better accuracy
        maximumAge: 0             // Always get fresh location data
      }
    );
  });
};

// Reverse geocode coordinates to get location name with more details
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<{
  displayName: string;
  city: string;
  state: string;
  country: string;
  street: string;
  suburb: string;
  fullAddress: string;
  raw: any;
}> => {
  try {
    // Using more detailed parameters for the Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18&accept-language=en`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ZructuresApp/1.0' // Add a proper user agent as per Nominatim guidelines
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to reverse geocode location: ${response.statusText}`);
    }

    const data = await response.json();
    const address = data.address;

    // Process address components with fallbacks for different naming conventions
    const city = address.city || address.town || address.village || address.hamlet || address.suburb || 'Tadipatri';
    const street = address.road || address.street || address.footway || address.path || 'Unknown road';
    const state = address.state || 'Andhra Pradesh';
    const suburb = address.suburb || address.neighbourhood || address.district || '';

    // Detailed address components
    return {
      displayName: data.display_name,
      city: city,
      state: state,
      country: address.country || 'India',
      street: street,
      suburb: suburb,
      fullAddress: formatFullAddress(address),
      raw: data // Keep the raw data for debugging
    };
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    toast.error("Failed to get your precise location address. Please try again.");
    throw error;
  }
};

// Format a complete address from components
const formatFullAddress = (address: any): string => {
  const components = [];
  
  if (address.road || address.street || address.footway || address.path)
    components.push(address.road || address.street || address.footway || address.path);
    
  if (address.suburb && address.suburb !== (address.road || address.street))
    components.push(address.suburb);
    
  if (address.city || address.town || address.village || address.hamlet)
    components.push(address.city || address.town || address.village || address.hamlet);
    
  if (address.state)
    components.push(address.state);
    
  if (address.postcode)
    components.push(address.postcode);
    
  // Only add country if we don't have many other components already
  if (address.country && components.length < 3)
    components.push(address.country);
    
  return components.join(", ");
};

// Get location display name for UI
export const getLocationDisplayName = (location: string): string => {
  if (!location || location === "All India") return "Select location";
  return location;
};

// Handle location update and check availability
export const handleLocationUpdate = (
  location: string,
  onUnavailable?: () => void
): void => {
  // If location is likely a full address, extract just the city part
  const cityPart = location.includes(", ") 
    ? location.split(", ")[0] // Take the first part before comma
    : location;
    
  const isAvailable = isZructuresAvailable(cityPart);
  
  // Save the location to localStorage
  localStorage.setItem("userLocation", location);
  
  // Dispatch custom event for other components to listen to
  window.dispatchEvent(
    new CustomEvent("locationUpdated", {
      detail: { location, isAvailable }
    })
  );
  
  // Show toast notification based on availability
  if (isAvailable) {
    toast.success(`Location updated to ${location}`);
  } else {
    toast.info(`Zructures is not yet available in ${cityPart}. We're expanding soon!`);
    if (onUnavailable) {
      onUnavailable();
    }
  }
};

// Attempt to get more accurate address using nominatim with additional parameters
export const getAccurateAddress = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    // Using the highest zoom level and most detailed request
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.append("format", "json");
    url.searchParams.append("lat", latitude.toString());
    url.searchParams.append("lon", longitude.toString());
    url.searchParams.append("addressdetails", "1");
    url.searchParams.append("zoom", "18");
    url.searchParams.append("namedetails", "1");
    url.searchParams.append("accept-language", "en");
    
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ZructuresApp/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to get accurate address");
    }
    
    const data = await response.json();
    
    // Log the complete response for debugging
    console.log("Detailed location data:", data);
    
    if (data.address) {
      const addr = data.address;
      const street = addr.road || addr.street || addr.pedestrian || addr.path || addr.footway || 'Unknown Street';
      const area = addr.suburb || addr.neighbourhood || addr.hamlet || '';
      const city = addr.city || addr.town || addr.village || addr.municipality || 'Tadipatri';
      
      // Build address string with everything we have
      let fullAddress = street;
      
      if (area && street !== area) {
        fullAddress += area ? `, ${area}` : '';
      }
      
      if (city && !fullAddress.includes(city)) {
        fullAddress += city ? `, ${city}` : '';
      }
      
      return fullAddress;
    }
    
    return data.display_name || "Location could not be determined precisely";
  } catch (error) {
    console.error("Error getting accurate address:", error);
    return "Unable to determine precise location";
  }
};

// Determine user's region based on coordinates
export const determineRegion = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const geocodeData = await reverseGeocode(latitude, longitude);
    
    // Check if we've detected Andhra Pradesh
    if (geocodeData.state.toLowerCase().includes("andhra")) {
      // Check specific regions within Andhra Pradesh
      const rayalaseemaDistricts = ["anantapur", "kadapa", "kurnool", "chittoor"];
      const coastalDistricts = ["visakhapatnam", "east godavari", "west godavari", "krishna", "guntur", "prakasam", "nellore"];
      
      // Try to get district from geocode data
      const district = geocodeData.raw?.address?.state_district || 
                      geocodeData.raw?.address?.county || 
                      '';
      
      if (district) {
        const districtLower = district.toLowerCase();
        
        if (rayalaseemaDistricts.some(d => districtLower.includes(d))) {
          return "Rayalaseema";
        } else if (coastalDistricts.some(d => districtLower.includes(d))) {
          return "Coastal Andhra";
        }
      }
    }
    
    return "Other"; // Default region
  } catch (error) {
    console.error("Error determining region:", error);
    return "Unknown";
  }
};
