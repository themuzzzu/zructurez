
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LocationContextType {
  location: string | null;
  setLocation: (location: string) => void;
  currentLocation: string;
  isLocationAvailable: boolean;
  setShowLocationPicker: (show: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>("All India");
  const [isLocationAvailable, setIsLocationAvailable] = useState<boolean>(false);

  useEffect(() => {
    // Try to load saved location from localStorage
    const savedLocation = localStorage.getItem('location');
    if (savedLocation) {
      setLocation(savedLocation);
      setCurrentLocation(savedLocation);
      
      // Check if location is available in our service areas
      // This is a simplified check - in a real app you would check against an API
      const availableLocations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai"];
      setIsLocationAvailable(availableLocations.includes(savedLocation));
    }
  }, []);

  const updateLocation = (newLocation: string) => {
    setLocation(newLocation);
    setCurrentLocation(newLocation);
    localStorage.setItem('location', newLocation);
    
    // Check if location is available in our service areas
    const availableLocations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai"];
    setIsLocationAvailable(availableLocations.includes(newLocation));
  };

  const setShowLocationPicker = (show: boolean) => {
    // Create and dispatch a custom event instead of using state
    if (show) {
      window.dispatchEvent(new Event('show-location-picker'));
    }
  };

  return (
    <LocationContext.Provider 
      value={{ 
        location, 
        setLocation: updateLocation, 
        currentLocation,
        isLocationAvailable,
        setShowLocationPicker
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
