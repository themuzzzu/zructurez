
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
  cityName: string | null;
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
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Store the precise location in state
        setState(prev => ({
          ...prev,
          position: { latitude, longitude, accuracy },
          loading: false,
        }));
        
        // Store complete location info in localStorage for future use
        localStorage.setItem('userPreciseLocation', JSON.stringify({
          latitude, 
          longitude, 
          accuracy,
          timestamp: new Date().toISOString()
        }));
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
      {
        enableHighAccuracy: true, // Use GPS if available
        timeout: 10000, // 10 seconds
        maximumAge: 0 // No cached position
      }
    );
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
