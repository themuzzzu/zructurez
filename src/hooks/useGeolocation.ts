
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  reverseGeocode, 
  normalizeLocationName, 
  getAccurateAddress,
  storePreciseLocation,
  showLocationAccessPrompt,
  isMobileDevice
} from "@/utils/locationUtils";
import { AVAILABLE_CITIES, normalizeLocationName as normalizeCity } from "@/utils/cityAvailabilityUtils";

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
  neighborhood: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    address: null,
    cityName: null,
    streetName: null,
    stateName: null,
    fullAddress: null,
    neighborhood: null,
    loading: false,
    error: null,
  });

  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");
  
  const [retries, setRetries] = useState(0);
  const [lastLocationUpdate, setLastLocationUpdate] = useState<number | null>(null);
  const MAX_RETRIES = 2;
  const MIN_UPDATE_INTERVAL = 60000; // 1 minute minimum between location updates
  const MIN_DISTANCE_CHANGE = 100; // 100 meters minimum distance to trigger update

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
  
  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = 
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  }, []);
  
  // Check if location update is needed based on time and distance
  const shouldUpdateLocation = useCallback((newPos: GeolocationPosition): boolean => {
    const now = Date.now();
    
    // Always update if this is the first location
    if (!state.position || !lastLocationUpdate) {
      return true;
    }
    
    // Check time interval
    if ((now - lastLocationUpdate) < MIN_UPDATE_INTERVAL) {
      return false;
    }
    
    // Check distance threshold
    const distance = calculateDistance(
      state.position.latitude,
      state.position.longitude,
      newPos.latitude,
      newPos.longitude
    );
    
    return distance > MIN_DISTANCE_CHANGE;
  }, [state.position, lastLocationUpdate, calculateDistance]);

  const requestGeolocation = useCallback(async (forceHighAccuracy: boolean = true) => {
    // If on desktop, use default location instead of requesting geolocation
    if (!isMobileDevice()) {
      // For desktops/laptops, provide default location data without making API calls
      const defaultPosition = { 
        latitude: 14.90409405, 
        longitude: 78.00200075,
        accuracy: 1000
      };
      
      setState(prev => ({
        ...prev,
        position: defaultPosition,
        loading: false,
        error: null,
        cityName: 'Tadipatri',
        stateName: 'Andhra Pradesh',
        fullAddress: 'Tadipatri, Andhra Pradesh 515411',
        address: 'Tadipatri, Andhra Pradesh 515411'
      }));
      
      return;
    }
    
    // Continue with mobile geolocation request
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }));
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    // Show first-time prompt if needed
    const shouldProceed = await showLocationAccessPrompt();
    if (!shouldProceed && localStorage.getItem('locationPromptShown') !== 'true') {
      // User declined the custom prompt
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    setRetries(0); // Reset retry counter

    const getPosition = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          console.log(`Location detected - Lat: ${latitude}, Lon: ${longitude}, Accuracy: ±${Math.round(accuracy)}m`);
          
          // Create position object
          const newPosition = { 
            latitude, 
            longitude, 
            accuracy, 
            timestamp: new Date().getTime()
          };
          
          // Check if we should update location based on time and distance
          if (!shouldUpdateLocation(newPosition)) {
            setState(prev => ({ ...prev, loading: false }));
            return;
          }
          
          // Store the precise location in state and update last update time
          setState(prev => ({
            ...prev,
            position: newPosition,
            loading: true, // Keep loading while we fetch address
          }));
          
          setLastLocationUpdate(Date.now());

          try {
            // Get detailed address using reverse geocoding
            const addressInfo = await reverseGeocode(latitude, longitude);
            console.log("Got address info:", addressInfo);
            
            // Check if we're within Tadipatri area by coordinates
            const isTadipatriArea = 
              (latitude >= 14.85 && latitude <= 14.98 && 
               longitude >= 77.90 && longitude <= 78.08);
            
            // Use the actual detected city but ensure Tadipatri is correctly identified
            let detectedCity = addressInfo.city;
            
            // If we're in Tadipatri area by coordinates or address mentions it
            if (isTadipatriArea || 
                addressInfo.displayName.toLowerCase().includes('tadipatri') ||
                (detectedCity && detectedCity.toLowerCase().includes('tadipatri'))) {
              detectedCity = 'Tadipatri';
            }
            
            // Never accept Kapula Uppada or other known incorrect cities
            if (detectedCity.toLowerCase().includes('kapula') || 
                detectedCity.toLowerCase().includes('bheemunipatnam') ||
                detectedCity.toLowerCase().includes('visakhapatnam')) {
              
              // If we have coordinates that match Tadipatri area, override with Tadipatri
              if (isTadipatriArea) {
                detectedCity = 'Tadipatri';
              } else {
                // If we're not in a known area, fall back to the first available city
                detectedCity = AVAILABLE_CITIES[0];
              }
            }
            
            // Store the precise location data
            storePreciseLocation(latitude, longitude, {
              city: detectedCity,
              neighborhood: addressInfo.neighborhood,
              street: addressInfo.street,
              state: addressInfo.state,
              displayName: addressInfo.displayName
            });
            
            setState(prev => ({
              ...prev,
              loading: false,
              cityName: detectedCity,
              streetName: addressInfo.street,
              stateName: addressInfo.state,
              fullAddress: addressInfo.displayName,
              neighborhood: addressInfo.neighborhood,
              address: formatAddress(addressInfo)
            }));
            
            if (accuracy > 1000) {
              toast.info("Location detected with low accuracy.", {
                description: "Try again in an open area for better results."
              });
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            
            // Use default location data if geocoding fails
            setState(prev => ({
              ...prev,
              loading: false,
              error: null,
              cityName: 'Tadipatri',
              stateName: 'Andhra Pradesh',
              fullAddress: 'Tadipatri, Andhra Pradesh 515411',
              address: 'Tadipatri, Andhra Pradesh 515411'
            }));
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
  }, [shouldUpdateLocation, state.position, lastLocationUpdate]);
  
  const formatAddress = (addressInfo: any): string => {
    let formattedAddress = '';
    
    // Use the neighborhood/suburb first if available
    if (addressInfo.neighborhood) {
      formattedAddress += addressInfo.neighborhood;
    }
    
    // Then add street if available and different from neighborhood
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
    
    return formattedAddress || addressInfo.displayName || '';
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
    getDistanceBetweenCoordinates,
    isDesktop: !isMobileDevice()
  };
}
