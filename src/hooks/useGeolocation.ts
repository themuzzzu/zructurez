
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { reverseGeocode } from "@/utils/locationUtils";

interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

interface GeolocationState {
  position: GeolocationPosition | null;
  address: string | null;
  loading: boolean;
  error: string | null;
  cityName: string | null;
  streetName: string | null;
  stateName: string | null;
  fullAddress: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    address: null,
    cityName: null,
    streetName: null,
    stateName: null,
    fullAddress: null,
    loading: false,
    error: null,
  });

  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");
  
  const [retries, setRetries] = useState(0);
  const MAX_RETRIES = 3;

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

  const requestGeolocation = (forceHighAccuracy: boolean = true) => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }));
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    setRetries(0); // Reset retry counter

    const getPosition = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          console.log(`Location detected - Lat: ${latitude}, Lon: ${longitude}, Accuracy: ±${Math.round(accuracy)}m`);
          
          // Store the precise location in state
          setState(prev => ({
            ...prev,
            position: { 
              latitude, 
              longitude, 
              accuracy, 
              timestamp: new Date().getTime()
            },
            loading: true, // Keep loading while we fetch address
          }));
          
          // Store complete location info in localStorage for future use
          localStorage.setItem('userPreciseLocation', JSON.stringify({
            latitude, 
            longitude, 
            accuracy,
            timestamp: new Date().toISOString()
          }));

          // Get detailed address using Nominatim's reverse geocoding
          try {
            const addressInfo = await reverseGeocode(latitude, longitude);
            console.log("Got address info:", addressInfo);
            
            setState(prev => ({
              ...prev,
              loading: false,
              cityName: addressInfo.city,
              streetName: addressInfo.street,
              stateName: addressInfo.state,
              fullAddress: addressInfo.displayName,
              address: formatAddress(addressInfo)
            }));
            
            // Store address in localStorage
            localStorage.setItem('userAddressDetails', JSON.stringify(addressInfo));
            
            if (accuracy > 1000) {
              toast.info("Location detected with low accuracy. Try again in an open area for better results.");
            } else {
              toast.success("Location detected successfully");
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            setState(prev => ({
              ...prev,
              loading: false,
              error: "Failed to get precise address"
            }));
            toast.error("Could not determine your exact address");
          }
        },
        (error) => {
          // If high accuracy fails, try with lower accuracy if we haven't already
          if (highAccuracy && retries < MAX_RETRIES) {
            setRetries(prev => prev + 1);
            console.log(`High accuracy location failed. Retrying with lower accuracy. Attempt ${retries + 1}/${MAX_RETRIES}`);
            
            setTimeout(() => {
              getPosition(false);
            }, 1000);
            return;
          }
          
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
          enableHighAccuracy: highAccuracy, // Use GPS for highest accuracy
          timeout: highAccuracy ? 15000 : 30000, // Longer timeout for high accuracy
          maximumAge: 0 // No cached position
        }
      );
    };
    
    // Start with high accuracy
    getPosition(forceHighAccuracy);
  };
  
  const formatAddress = (addressInfo: any): string => {
    let formattedAddress = '';
    
    if (addressInfo.street) {
      formattedAddress += addressInfo.street;
    }
    
    if (addressInfo.suburb && addressInfo.suburb !== addressInfo.street) {
      formattedAddress += formattedAddress ? `, ${addressInfo.suburb}` : addressInfo.suburb;
    }
    
    if (addressInfo.city) {
      formattedAddress += formattedAddress ? `, ${addressInfo.city}` : addressInfo.city;
    }
    
    if (addressInfo.state) {
      formattedAddress += formattedAddress ? `, ${addressInfo.state}` : addressInfo.state;
    }
    
    return formattedAddress;
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
