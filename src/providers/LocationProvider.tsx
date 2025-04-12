
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkCityAvailability, DEFAULT_CITY } from '@/utils/cityAvailabilityUtils';
import { supabase } from '@/integrations/supabase/client';

interface LocationContextType {
  currentLocation: string;
  isLocationAvailable: boolean;
  isFirstVisit: boolean;
  showLocationPicker: boolean;
  setShowLocationPicker: (show: boolean) => void;
  setCurrentLocation: (location: string) => void;
  resetFirstVisit: () => void;
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
      }
    };

    window.addEventListener('locationUpdated', handleLocationUpdated as EventListener);
    
    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdated as EventListener);
    };
  }, []);
  
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

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isLocationAvailable,
        isFirstVisit,
        showLocationPicker,
        setShowLocationPicker,
        setCurrentLocation,
        resetFirstVisit
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
