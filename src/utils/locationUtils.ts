
import { 
  normalizeLocationName as normalizeCityName, 
  AVAILABLE_CITIES 
} from './cityAvailabilityUtils';
import { toast } from 'sonner';

// Export normalizeLocationName from this file
export const normalizeLocationName = normalizeCityName;

// Use OpenStreetMap's Nominatim for reverse geocoding (free)
export const reverseGeocode = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { 
        headers: { 
          'Accept-Language': 'en',
          'User-Agent': 'zructures-location-lookup' // Added User-Agent to avoid rate limiting
        } 
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }
    
    const data = await response.json();
    
    const addressParts = data.address || {};
    const display = data.display_name || '';
    
    return {
      street: addressParts.road || addressParts.pedestrian || addressParts.suburb || '',
      neighborhood: addressParts.suburb || addressParts.neighbourhood || addressParts.residential || addressParts.quarter || '',
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
    
    // Format the address using the accurate components
    let formattedAddress = '';
    
    // Add neighborhood if available
    if (osmAddressInfo.neighborhood) {
      formattedAddress = osmAddressInfo.neighborhood;
    }
    
    // Add street if available and different from neighborhood
    if (osmAddressInfo.street && osmAddressInfo.street !== osmAddressInfo.neighborhood) {
      formattedAddress += formattedAddress ? `, ${osmAddressInfo.street}` : osmAddressInfo.street;
    }
    
    // Add city if available
    if (osmAddressInfo.city) {
      formattedAddress += formattedAddress ? `, ${osmAddressInfo.city}` : osmAddressInfo.city;
    }
    
    if (osmAddressInfo.state) {
      formattedAddress += formattedAddress ? `, ${osmAddressInfo.state}` : osmAddressInfo.state;
    }
    
    return formattedAddress || osmAddressInfo.displayName || "Unknown location";
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
      resolve(false);
      return;
    }
    
    if ('permissions' in navigator) {
      // Check current permission status
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            // Already granted, no need for prompt
            localStorage.setItem('locationPromptShown', 'true');
            resolve(false);
          } else if (permissionStatus.state === 'prompt') {
            // Need to show our custom prompt first
            toast(
              "Allow location access for a better experience",
              {
                description: "We use your precise location to show you relevant content nearby.",
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
          } else {
            // Already denied, just mark as shown
            localStorage.setItem('locationPromptShown', 'true');
            resolve(false);
          }
        })
        .catch(() => {
          // Error checking permissions, just show the prompt
          toast(
            "Allow location access for a better experience",
            {
              description: "We use your precise location to show you relevant content nearby.",
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
    } else {
      // Permissions API not available, just show standard toast
      toast(
        "Allow location access for a better experience",
        {
          description: "We use your precise location to show you relevant content nearby.",
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
    }
  });
};
