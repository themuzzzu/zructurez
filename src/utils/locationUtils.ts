
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
