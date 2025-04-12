
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isZructuresAvailable } from '@/utils/locationUtils';

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
    localStorage.getItem('userLocation') || 'All India'
  );
  const [isLocationAvailable, setIsLocationAvailable] = useState<boolean>(
    isZructuresAvailable(currentLocation)
  );
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(
    localStorage.getItem('locationPromptShown') !== 'true'
  );
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(isFirstVisit);

  useEffect(() => {
    const handleLocationUpdated = (event: CustomEvent) => {
      if (event.detail.location) {
        setCurrentLocation(event.detail.location);
        setIsLocationAvailable(isZructuresAvailable(event.detail.location));
      }
    };

    window.addEventListener('locationUpdated', handleLocationUpdated as EventListener);
    
    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdated as EventListener);
    };
  }, []);
  
  useEffect(() => {
    // Check availability whenever location changes
    setIsLocationAvailable(isZructuresAvailable(currentLocation));
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
