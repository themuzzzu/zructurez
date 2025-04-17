
import { createContext, useContext, useState, ReactNode } from 'react';

interface LocationContextType {
  location: string | null;
  setLocation: (location: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<string | null>(null);

  const updateLocation = (newLocation: string) => {
    setLocation(newLocation);
    localStorage.setItem('location', newLocation);
  };

  return (
    <LocationContext.Provider value={{ location, setLocation: updateLocation }}>
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
