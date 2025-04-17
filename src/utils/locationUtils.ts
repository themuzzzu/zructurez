
/**
 * Detects if the current device is mobile
 * @returns boolean indicating if the device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window !== 'undefined') {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  }
  return false;
}

/**
 * Checks if a location is available in Zructures
 * @param location The location string to check
 * @returns boolean indicating if the location is available
 */
export function isZructuresAvailable(location: string): boolean {
  const availableLocations = [
    'tadipatri', 'anantapur', 'hyderabad', 'bangalore', 
    'chennai', 'vijayawada', 'tirupati', 'andhra pradesh'
  ];
  
  const normalizedLocation = location.toLowerCase();
  return availableLocations.some(loc => normalizedLocation.includes(loc));
}

/**
 * Gets an accurate address based on coordinates
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Promise with the formatted address
 */
export async function getAccurateAddress(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    }
    throw new Error('No address found');
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    throw error;
  }
}

/**
 * Shows a location access prompt for first-time users
 * @returns Promise with boolean indicating if the prompt was shown
 */
export async function showLocationAccessPrompt(): Promise<boolean> {
  // Only show if this is the first time
  const hasShownPrompt = localStorage.getItem('locationPromptShown') === 'true';
  if (!hasShownPrompt && !isMobileDevice()) {
    localStorage.setItem('locationPromptShown', 'true');
    return false; // Don't auto-request on desktop
  }
  
  if (!hasShownPrompt && isMobileDevice()) {
    localStorage.setItem('locationPromptShown', 'true');
    return true; // Auto-request on mobile
  }
  
  return false;
}

/**
 * Updates the user's location
 * @param location The location string to set
 */
export function handleLocationUpdate(location: string): void {
  // Store the location in localStorage
  localStorage.setItem('userLocation', location);
  
  // Also dispatch a custom event for components that listen for location changes
  const isAvailable = isZructuresAvailable(location);
  const event = new CustomEvent('locationUpdated', { 
    detail: { 
      location, 
      isAvailable 
    } 
  });
  window.dispatchEvent(event);
}

/**
 * Normalizes a location name by removing special characters and standardizing format
 * @param locationName The location name to normalize
 * @returns The normalized location name
 */
export function normalizeLocationName(locationName: string): string {
  // Convert to lowercase and remove extraneous spaces
  let normalized = locationName.toLowerCase().trim();
  
  // Remove special characters that might cause comparison issues
  normalized = normalized.replace(/[^\w\s]/gi, '');
  
  // Replace multiple spaces with single space
  normalized = normalized.replace(/\s+/g, ' ');
  
  return normalized;
}

/**
 * Reverse geocodes coordinates to get address information
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Promise with the address information
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<{
  city: string;
  street: string;
  neighborhood: string;
  state: string;
  displayName: string;
}> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const data = await response.json();
    
    if (!data) {
      throw new Error('No data returned from geocoding service');
    }
    
    // Extract relevant information
    const address = data.address || {};
    const city = address.city || address.town || address.village || address.hamlet || 'Unknown';
    const street = address.road || address.pedestrian || address.footway || '';
    const neighborhood = address.suburb || address.neighbourhood || address.residential || '';
    const state = address.state || '';
    
    return {
      city,
      street,
      neighborhood,
      state,
      displayName: data.display_name || ''
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw error;
  }
}

/**
 * Stores precise location data in localStorage
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @param addressInfo Additional address information
 */
export function storePreciseLocation(
  latitude: number, 
  longitude: number, 
  addressInfo?: {
    city?: string;
    neighborhood?: string;
    street?: string;
    state?: string;
    displayName?: string;
  }
): void {
  try {
    const locationData = {
      latitude,
      longitude,
      timestamp: new Date().getTime(),
      addressInfo
    };
    
    localStorage.setItem('userPreciseLocation', JSON.stringify(locationData));
  } catch (error) {
    console.error('Error storing precise location:', error);
  }
}
