import { 
  normalizeLocationName as normalizeCityName, 
  AVAILABLE_CITIES 
} from './cityAvailabilityUtils';
import { toast } from 'sonner';

// Export normalizeLocationName from this file
export const normalizeLocationName = normalizeCityName;

// Detect if device is mobile/tablet
export const isMobileDevice = () => {
  return window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Use OpenStreetMap's Nominatim for reverse geocoding (free) with rate limiting
const geocodingRequests = new Map();
const GEOCODING_THROTTLE_MS = 5000; // Increased throttle time to avoid rate limiting
const GEOCODING_CACHE = new Map(); // Cache for geocoding results

export const reverseGeocode = async (lat: number, lon: number) => {
  try {
    // Create a key for this request to avoid duplicates
    const requestKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    
    // Check cache first
    if (GEOCODING_CACHE.has(requestKey)) {
      console.log(`Using cached geocoding result for ${requestKey}`);
      return GEOCODING_CACHE.get(requestKey);
    }
    
    // Check if we've made this request recently
    const lastRequestTime = geocodingRequests.get(requestKey);
    const now = Date.now();
    
    if (lastRequestTime && (now - lastRequestTime) < GEOCODING_THROTTLE_MS) {
      console.log(`Skipping geocoding request for ${requestKey}, too soon since last request`);
      
      // Return a default fallback result for this location
      const fallbackResult = getFallbackLocationData(lat, lon);
      return fallbackResult;
    }
    
    // On desktop and laptop devices, don't make geocoding requests, use default location
    if (!isMobileDevice()) {
      return getDefaultLocationData();
    }
    
    // Record this request time
    geocodingRequests.set(requestKey, now);
    
    // Clean up old requests (keep map size manageable)
    if (geocodingRequests.size > 20) {
      const oldestKey = [...geocodingRequests.keys()][0];
      geocodingRequests.delete(oldestKey);
    }
    
    // Use fallback data if coordinates are near Tadipatri
    if (isTadipatriArea(lat, lon)) {
      return getDefaultLocationData();
    }
    
    // Add a random delay between 0-1 seconds to avoid simultaneous requests
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { 
        headers: { 
          'Accept-Language': 'en',
          'User-Agent': 'zructures-location-lookup' 
        } 
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }
    
    const data = await response.json();
    
    const addressParts = data.address || {};
    const display = data.display_name || '';
    
    // Check if location is in Tadipatri area by coordinates
    // This is a safeguard to ensure our service area is correctly identified
    let city = addressParts.city || addressParts.town || addressParts.village || addressParts.hamlet || '';
    
    // If location is in Anantapur district or near Tadipatri coordinates,
    // ensure we identify it as Tadipatri
    if ((addressParts.county === 'Anantapur' && 
         (city.toLowerCase().includes('tadipatri') || 
          display.toLowerCase().includes('tadipatri'))) || 
        isTadipatriArea(lat, lon)) {
      city = 'Tadipatri';
    }
    
    // Never return Kapula Uppada or other incorrect locations
    // Filter out known false positives
    if (city.toLowerCase().includes('kapula') || 
        city.toLowerCase().includes('bheemunipatnam') ||
        city.toLowerCase().includes('visakhapatnam')) {
      
      // If we have coordinates that match Tadipatri area, override the incorrect city
      if (isTadipatriArea(lat, lon)) {
        city = 'Tadipatri';
      } else {
        // If we can't determine a reliable city, use the first available city as fallback
        city = AVAILABLE_CITIES[0];
      }
    }
    
    const result = {
      street: addressParts.road || addressParts.pedestrian || addressParts.suburb || '',
      neighborhood: addressParts.suburb || addressParts.neighbourhood || addressParts.residential || addressParts.quarter || '',
      city: city,
      state: addressParts.state || '',
      country: addressParts.country || '',
      postcode: addressParts.postcode || '',
      suburb: addressParts.suburb || '',
      displayName: display
    };
    
    // Cache the result
    GEOCODING_CACHE.set(requestKey, result);
    
    // Clean up cache if it gets too big
    if (GEOCODING_CACHE.size > 50) {
      const oldestKey = [...GEOCODING_CACHE.keys()][0];
      GEOCODING_CACHE.delete(oldestKey);
    }
    
    return result;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    
    // Provide fallback data based on coordinates
    return getFallbackLocationData(lat, lon);
  }
};

// Get default location data for Tadipatri
const getDefaultLocationData = () => {
  return {
    street: '',
    neighborhood: '',
    city: 'Tadipatri',
    state: 'Andhra Pradesh',
    country: 'India',
    postcode: '515411',
    suburb: '',
    displayName: 'Tadipatri, Andhra Pradesh 515411, India'
  };
};

// Get fallback location data based on coordinates
const getFallbackLocationData = (lat: number, lon: number) => {
  // If coordinates are near Tadipatri, return Tadipatri data
  if (isTadipatriArea(lat, lon)) {
    return getDefaultLocationData();
  }
  
  // Otherwise return generic data with coordinates
  return {
    street: '',
    neighborhood: '',
    city: 'Unknown Location',
    state: '',
    country: 'India',
    postcode: '',
    suburb: '',
    displayName: `Location at coordinates: ${lat.toFixed(6)},${lon.toFixed(6)}`
  };
};

// Helper function to check if coordinates are within Tadipatri area
// Using approximate bounding box for Tadipatri
const isTadipatriArea = (lat: number, lon: number): boolean => {
  // Expanded bounding box for Tadipatri area
  const tadipatriBounds = {
    minLat: 14.85, maxLat: 14.98,
    minLon: 77.90, maxLon: 78.08
  };
  
  return (lat >= tadipatriBounds.minLat && lat <= tadipatriBounds.maxLat && 
          lon >= tadipatriBounds.minLon && lon <= tadipatriBounds.maxLon);
};

// Get a more accurate address using OpenStreetMap
export const getAccurateAddress = async (latitude: number, longitude: number): Promise<string> => {
  try {
    // For desktop devices, return a default address to avoid API calls
    if (!isMobileDevice()) {
      return "Tadipatri, Andhra Pradesh 515411";
    }
    
    // Check cache first
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    if (GEOCODING_CACHE.has(cacheKey)) {
      const cachedData = GEOCODING_CACHE.get(cacheKey);
      return formatAddress(cachedData);
    }
    
    // For mobile devices, try with OpenStreetMap but with rate limiting
    const requestKey = `accurate-${cacheKey}`;
    const lastRequestTime = geocodingRequests.get(requestKey);
    const now = Date.now();
    
    if (lastRequestTime && (now - lastRequestTime) < GEOCODING_THROTTLE_MS) {
      return "Tadipatri, Andhra Pradesh"; // Fallback when rate limiting
    }
    
    // Record this request
    geocodingRequests.set(requestKey, now);
    
    const osmAddressInfo = await reverseGeocode(latitude, longitude);
    return formatAddress(osmAddressInfo);
  } catch (error) {
    console.error("Error getting accurate address:", error);
    return "Tadipatri, Andhra Pradesh 515411";
  }
};

// Format address from components
const formatAddress = (addressInfo: any): string => {
  if (!addressInfo) return "Tadipatri, Andhra Pradesh";
  
  let formattedAddress = '';
  
  // Add neighborhood if available
  if (addressInfo.neighborhood) {
    formattedAddress = addressInfo.neighborhood;
  }
  
  // Add street if available and different from neighborhood
  if (addressInfo.street && addressInfo.street !== addressInfo.neighborhood) {
    formattedAddress += formattedAddress ? `, ${addressInfo.street}` : addressInfo.street;
  }
  
  // Add city if available
  if (addressInfo.city) {
    formattedAddress += formattedAddress ? `, ${addressInfo.city}` : addressInfo.city;
  }
  
  if (addressInfo.state) {
    formattedAddress += formattedAddress ? `, ${addressInfo.state}` : addressInfo.state;
  }
  
  return formattedAddress || addressInfo.displayName || "Tadipatri, Andhra Pradesh";
};

// Check if Zructures is available in given location
export const isZructuresAvailable = (locationName: string): boolean => {
  if (!locationName || locationName === "All India") return true;
  
  // Extract city name before any comma
  const cityPart = locationName.split(',')[0].trim();
  
  // Normalize the city name
  const normalizedCity = normalizeLocationName(cityPart);
  
  // Special case for locations that we know are in Tadipatri area
  if (locationName.toLowerCase().includes('tadipatri') ||
      locationName.toLowerCase().includes('tadpatri') ||
      locationName.toLowerCase().includes('nh67') ||
      locationName.toLowerCase().includes('nh544')) {
    return true;
  }
  
  // Check if it's in our list of available cities
  return AVAILABLE_CITIES.some(city => 
    normalizedCity.toLowerCase() === city.toLowerCase() ||
    normalizedCity.toLowerCase().includes(city.toLowerCase())
  );
};

// Handle location updates
export const handleLocationUpdate = (location: string): void => {
  if (!location) return;
  
  // Store in localStorage
  localStorage.setItem('userLocation', location);
  
  // Check availability
  const isAvailable = isZructuresAvailable(location);
  
  // Dispatch custom event for other components
  window.dispatchEvent(new CustomEvent('locationUpdated', { 
    detail: { 
      location: location,
      isAvailable: isAvailable
    } 
  }));
  
  console.log(`Location updated: ${location} (Available: ${isAvailable ? 'Yes' : 'No'})`);
};

// Store precise location data including neighborhood
export const storePreciseLocation = (
  latitude: number, 
  longitude: number, 
  addressInfo: {
    city?: string, 
    neighborhood?: string, 
    street?: string, 
    state?: string,
    displayName?: string
  }
) => {
  try {
    const locationData = {
      latitude,
      longitude,
      city: addressInfo.city || '',
      neighborhood: addressInfo.neighborhood || '',
      street: addressInfo.street || '',
      state: addressInfo.state || '',
      displayName: addressInfo.displayName || '',
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('userPreciseLocation', JSON.stringify(locationData));
    
    return locationData;
  } catch (error) {
    console.error("Error storing precise location:", error);
    return null;
  }
};

// Get stored precise location data
export const getStoredPreciseLocation = () => {
  try {
    const storedData = localStorage.getItem('userPreciseLocation');
    if (!storedData) return null;
    
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error retrieving stored location:", error);
    return null;
  }
};

// Function to show first-time location access prompt
export const showLocationAccessPrompt = () => {
  return new Promise<boolean>((resolve) => {
    // Check if we've already shown this prompt before
    if (localStorage.getItem('locationPromptShown') === 'true') {
      resolve(true);
      return;
    }
    
    // For desktop devices, don't show the prompt
    if (!isMobileDevice()) {
      localStorage.setItem('locationPromptShown', 'true');
      resolve(false);
      return;
    }
    
    toast(
      "Allow location access for a better experience",
      {
        description: "We use your precise location to show you relevant services in your area and improve delivery accuracy.",
        action: {
          label: "Allow",
          onClick: () => {
            localStorage.setItem('locationPromptShown', 'true');
            resolve(true);
          }
        },
        cancel: {
          label: "Not now",
          onClick: () => {
            resolve(false);
          }
        },
        duration: 10000,
      }
    );
  });
};
