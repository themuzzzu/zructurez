
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { findNearestCity } from "@/utils/cityAvailabilityUtils";

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
  cityName: string | null;
}

interface ReverseGeocodeResult {
  displayName: string;
  locality: string | null;
  neighborhood: string | null;
  suburb: string | null;
  city: string | null;
  town: string | null;
  state: string | null;
  country: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    address: null,
    cityName: null,
    loading: false,
    error: null,
  });

  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");

  // Check permission status on mount
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

  // Load saved position from localStorage on initial mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userPreciseLocation');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        if (parsed.latitude && parsed.longitude) {
          setState(prev => ({
            ...prev,
            position: {
              latitude: parsed.latitude,
              longitude: parsed.longitude,
              accuracy: parsed.accuracy
            },
            address: parsed.address || null,
            cityName: parsed.city || null
          }));
        }
      } catch (e) {
        console.error("Error parsing saved location:", e);
      }
    }
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
            cityName: response.city || response.town || null,
          }));
          
          // Check if we have a city match in our database
          if (response.city || response.town) {
            const cityName = response.city || response.town;
            try {
              const nearestCity = await findNearestCity(latitude, longitude);
              
              // If we have a city in our database, update the app's location
              if (nearestCity) {
                // Check if city is available in our system
                const { data: cityData } = await supabase
                  .from('city_availability')
                  .select('is_available')
                  .eq('city_name', nearestCity)
                  .single();
                  
                const isAvailable = cityData?.is_available || false;
                
                // Update location in localStorage and dispatch event
                localStorage.setItem('userLocation', nearestCity);
                
                const event = new CustomEvent('locationUpdated', { 
                  detail: { 
                    location: nearestCity,
                    isAvailable,
                    latitude, 
                    longitude,
                    preciseLocation: response.displayName
                  } 
                });
                
                window.dispatchEvent(event);
              }
            } catch (error) {
              console.error("Error finding nearest city:", error);
            }
          }
          
          // Store complete location info in localStorage
          localStorage.setItem('userPreciseLocation', JSON.stringify({
            latitude, 
            longitude, 
            accuracy,
            address: response.displayName,
            locality: response.locality || response.neighborhood || response.suburb,
            city: response.city || response.town,
            state: response.state,
            country: response.country
          }));
          
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

  const reverseGeocode = async (latitude: number, longitude: number): Promise<ReverseGeocodeResult> => {
    try {
      // Using OpenStreetMap's Nominatim service for reverse geocoding (free and doesn't require API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to reverse geocode');
      }
      
      const data = await response.json();
      const address = data.address || {};
      
      return {
        displayName: data.display_name || "",
        locality: address.suburb || address.neighbourhood || address.hamlet || null,
        neighborhood: address.neighbourhood || address.hamlet || null,
        suburb: address.suburb || null,
        city: address.city || null,
        town: address.town || null,
        state: address.state || null,
        country: address.country || null
      };
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      throw error;
    }
  };

  const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
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

  // Function to calculate distance between two coordinates using Haversine formula
  const getDistanceBetweenCoordinates = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    // Radius of the Earth in kilometers
    const R = 6371;
    
    // Convert degrees to radians
    const deg2rad = (deg: number) => deg * (Math.PI / 180);
    
    // Calculate differences
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    
    // Haversine formula calculation
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // Distance in kilometers
    return R * c;
  };

  return { 
    ...state, 
    requestGeolocation, 
    permissionStatus,
    getDistanceBetweenCoordinates
  };
}
