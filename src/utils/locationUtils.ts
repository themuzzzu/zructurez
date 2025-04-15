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
  const cityPart = location.includes(" - ") ? location.split(" - ")[0] : location;
  
  // Check if the city is in our list of available cities
  return availableCities.some(city => 
    cityPart.toLowerCase() === city.toLowerCase()
  );
};

// Get user's current location using browser's Geolocation API
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Reverse geocode coordinates to get location name
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<{
  displayName: string;
  city: string;
  state: string;
  country: string;
}> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error("Failed to reverse geocode location");
    }

    const data = await response.json();
    const address = data.address;

    return {
      displayName: data.display_name,
      city: address.city || address.town || address.village || "",
      state: address.state || "",
      country: address.country || "",
    };
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    throw error;
  }
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
  const isAvailable = isZructuresAvailable(location);
  
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
    toast.info(`Zructures is not yet available in ${location}. We're expanding soon!`);
    if (onUnavailable) {
      onUnavailable();
    }
  }
};
