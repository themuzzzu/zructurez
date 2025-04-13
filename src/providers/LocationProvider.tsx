
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkCityAvailability, DEFAULT_CITY } from '@/utils/cityAvailabilityUtils';
import { supabase } from '@/integrations/supabase/client';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationContextType {
  currentLocation: string;
  isLocationAvailable: boolean;
  isFirstVisit: boolean;
  showLocationPicker: boolean;
  setShowLocationPicker: (show: boolean) => void;
  setCurrentLocation: (location: string) => void;
  resetFirstVisit: () => void;
  latitude: number | null;
  longitude: number | null;
  isDetectingLocation: boolean;
  detectLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<string>(
    localStorage.getItem('userLocation') || DEFAULT_CITY
  );
  const [isLocationAvailable, setIsLocationAvailable] = useState<boolean>(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(
    localStorage.getItem('locationPromptShown') !== 'true'
  );
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(isFirstVisit);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const { requestGeolocation, position, loading: isDetectingLocation } = useGeolocation();

  // Check city availability on mount and when location changes
  useEffect(() => {
    const checkAvailability = async () => {
      const isAvailable = await checkCityAvailability(currentLocation);
      setIsLocationAvailable(isAvailable);
    };
    
    checkAvailability();
  }, [currentLocation]);

  useEffect(() => {
    const handleLocationUpdated = (event: CustomEvent) => {
      if (event.detail.location) {
        setCurrentLocation(event.detail.location);
        setIsLocationAvailable(event.detail.isAvailable);
        
        if (event.detail.latitude && event.detail.longitude) {
          setLatitude(event.detail.latitude);
          setLongitude(event.detail.longitude);
        }
      }
    };

    window.addEventListener('locationUpdated', handleLocationUpdated as EventListener);
    
    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdated as EventListener);
    };
  }, []);
  
  // Check for previously stored geolocation and update state
  useEffect(() => {
    const savedLocation = localStorage.getItem('userPreciseLocation');
    
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        if (parsedLocation.latitude && parsedLocation.longitude) {
          setLatitude(parsedLocation.latitude);
          setLongitude(parsedLocation.longitude);
        }
      } catch (e) {
        console.error('Error parsing stored location:', e);
      }
    }
  }, []);
  
  // Update coordinates when position changes
  useEffect(() => {
    if (position) {
      setLatitude(position.latitude);
      setLongitude(position.longitude);
    }
  }, [position]);
  
  // On first mount, try to detect location automatically if it's the first visit
  useEffect(() => {
    if (isFirstVisit && navigator.geolocation) {
      // Small delay to ensure the app is fully loaded first
      const timer = setTimeout(() => {
        requestGeolocation();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit, requestGeolocation]);
  
  // Subscribe to real-time updates of city_availability table
  useEffect(() => {
    const subscription = supabase
      .channel('city_availability_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'city_availability',
        filter: `city_name=eq.${currentLocation}` 
      }, (payload) => {
        if (payload.new && payload.new.is_available !== undefined) {
          setIsLocationAvailable(payload.new.is_available);
        }
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [currentLocation]);
  
  const resetFirstVisit = () => {
    setIsFirstVisit(false);
    localStorage.setItem('locationPromptShown', 'true');
  };
  
  const detectLocation = () => {
    requestGeolocation();
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isLocationAvailable,
        isFirstVisit,
        showLocationPicker,
        setShowLocationPicker,
        setCurrentLocation,
        resetFirstVisit,
        latitude,
        longitude,
        isDetectingLocation,
        detectLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
