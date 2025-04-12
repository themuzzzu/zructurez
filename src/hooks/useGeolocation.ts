
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface GeolocationState {
  position: GeolocationPosition | null;
  address: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    address: null,
    loading: false,
    error: null,
  });

  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");

  useEffect(() => {
    const checkPermission = async () => {
      if (!("permissions" in navigator)) return;
      
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        setPermissionStatus(permission.state as "granted" | "denied" | "prompt");
        
        permission.onchange = function() {
          setPermissionStatus(this.state as "granted" | "denied" | "prompt");
        };
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
      }
    };
    
    checkPermission();
  }, []);

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }));
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        setState(prev => ({
          ...prev,
          position: { latitude, longitude, accuracy },
          loading: false,
        }));
        
        // Reverse geocode the coordinates to get address
        try {
          const response = await reverseGeocode(latitude, longitude);
          setState(prev => ({
            ...prev,
            address: response.displayName,
          }));
          
          // Store in localStorage
          localStorage.setItem('userPreciseLocation', JSON.stringify({
            latitude, 
            longitude, 
            address: response.displayName,
            locality: response.locality || response.neighborhood || response.suburb,
            city: response.city || response.town,
            state: response.state,
            country: response.country
          }));
          
          // Set visual location
          const locationName = response.locality || response.neighborhood || response.suburb || response.city || response.town;
          if (locationName) {
            const city = response.city || response.town || '';
            const displayLocation = city ? `${locationName}, ${city}` : locationName;
            localStorage.setItem('userLocation', displayLocation);
            
            // Dispatch custom event for other components
            window.dispatchEvent(
              new CustomEvent('locationUpdated', { 
                detail: { 
                  location: displayLocation,
                  latitude, 
                  longitude, 
                  preciseLocation: response.displayName
                } 
              })
            );
            
            toast.success(`Location updated to ${displayLocation}`);
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
        }
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: getGeolocationErrorMessage(error),
          loading: false,
        }));
        
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please enable location in your browser settings.");
        } else {
          toast.error(getGeolocationErrorMessage(error));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      // Using OpenStreetMap's Nominatim service for reverse geocoding (free and doesn't require API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to reverse geocode');
      }
      
      const data = await response.json();
      const address = data.address;
      
      return {
        displayName: data.display_name,
        locality: address.suburb || address.neighbourhood || address.hamlet,
        neighborhood: address.neighbourhood || address.hamlet,
        suburb: address.suburb,
        city: address.city,
        town: address.town,
        state: address.state,
        country: address.country
      };
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      throw error;
    }
  };

  const getGeolocationErrorMessage = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location permission denied";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable";
      case error.TIMEOUT:
        return "Request to get location timed out";
      default:
        return "An unknown error occurred getting your location";
    }
  };

  return { 
    ...state, 
    requestGeolocation, 
    permissionStatus 
  };
}
