import { 
  normalizeLocationName as normalizeCityName, 
  AVAILABLE_CITIES 
} from './cityAvailabilityUtils';

// Export normalizeLocationName from this file
export const normalizeLocationName = normalizeCityName;

// Use OpenStreetMap's Nominatim for reverse geocoding (free)
export const reverseGeocode = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    
    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }
    
    const data = await response.json();
    
    const addressParts = data.address || {};
    const display = data.display_name || '';
    
    return {
      street: addressParts.road || addressParts.pedestrian || addressParts.suburb || '',
      city: addressParts.city || addressParts.town || addressParts.village || addressParts.hamlet || '',
      state: addressParts.state || '',
      country: addressParts.country || '',
      postcode: addressParts.postcode || '',
      suburb: addressParts.suburb || '',
      displayName: display
    };
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    throw error;
  }
};

// Get a more accurate address using OpenStreetMap or backup services
export const getAccurateAddress = async (latitude: number, longitude: number): Promise<string> => {
  try {
    // First try with OpenStreetMap
    const osmAddressInfo = await reverseGeocode(latitude, longitude);
    
    // Normalize the city name to match our known locations
    const detectedCity = osmAddressInfo.city ? normalizeLocationName(osmAddressInfo.city) : '';
    
    // Format the address giving priority to known cities
    let formattedAddress = '';
    
    if (osmAddressInfo.street) {
      formattedAddress += osmAddressInfo.street;
    }
    
    if (osmAddressInfo.suburb && osmAddressInfo.suburb !== osmAddressInfo.street) {
      formattedAddress += formattedAddress ? `, ${osmAddressInfo.suburb}` : osmAddressInfo.suburb;
    }
    
    // Check if the detected city is in our available cities list
    const isKnownCity = AVAILABLE_CITIES.some(city => 
      detectedCity.toLowerCase() === city.toLowerCase() ||
      detectedCity.toLowerCase().includes(city.toLowerCase())
    );
    
    // If it's a known city, use it. Otherwise, find the nearest city
    if (isKnownCity) {
      formattedAddress += formattedAddress ? `, ${detectedCity}` : detectedCity;
    } else {
      // Find nearest city by coordinates - this would need to be implemented
      // For now we'll use the detected city as a fallback
      formattedAddress += formattedAddress ? `, ${detectedCity}` : detectedCity;
    }
    
    if (osmAddressInfo.state) {
      formattedAddress += formattedAddress ? `, ${osmAddressInfo.state}` : osmAddressInfo.state;
    }
    
    return formattedAddress || "Unknown location";
  } catch (error) {
    console.error("Error getting accurate address:", error);
    return "Location detection failed";
  }
};

// Check if Zructures is available in given location
export const isZructuresAvailable = (locationName: string): boolean => {
  if (!locationName || locationName === "All India") return true;
  
  // Extract city name before any comma
  const cityPart = locationName.split(',')[0].trim();
  
  // Normalize the city name
  const normalizedCity = normalizeLocationName(cityPart);
  
  // Check if it's in our list of available cities
  return AVAILABLE_CITIES.some(city => 
    normalizedCity.toLowerCase() === city.toLowerCase() ||
    normalizedCity.toLowerCase().includes(city.toLowerCase())
  );
};

// Handle location updates
export const handleLocationUpdate = (location: string): void => {
  if (!location) return;
  
  // Normalize location name
  const cityPart = location.split(',')[0].trim();
  const normalizedCity = normalizeLocationName(cityPart);
  
  // Store in localStorage
  localStorage.setItem('userLocation', location);
  
  // Check availability
  const isAvailable = isZructuresAvailable(normalizedCity);
  
  // Dispatch custom event for other components
  window.dispatchEvent(new CustomEvent('locationUpdated', { 
    detail: { 
      location: location,
      isAvailable: isAvailable
    } 
  }));
  
  console.log(`Location updated: ${location} (Available: ${isAvailable ? 'Yes' : 'No'})`);
};

// Find nearest available city based on coordinates
export const findNearestAvailableCity = async (latitude: number, longitude: number): Promise<string> => {
  // For now we'll just return the first available city
  // In a real implementation, this would calculate distances to all cities
  // and return the nearest one
  return AVAILABLE_CITIES[0];
};
