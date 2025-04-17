
import React, { createContext, useContext, useState, useEffect } from "react";

interface LocationContextType {
  location: string;
  setLocation: (location: string) => void;
  latitude: number | null;
  longitude: number | null;
  setCurrentLocation: (lat: number, lng: number) => void;
}

const defaultLocationContext: LocationContextType = {
  location: "Delhi",
  setLocation: () => {},
  latitude: null,
  longitude: null,
  setCurrentLocation: () => {},
};

const LocationContext = createContext<LocationContextType>(defaultLocationContext);

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<string>(() => {
    const savedLocation = localStorage.getItem("user-location");
    return savedLocation || "Delhi";
  });
  
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("user-location", location);
  }, [location]);

  const setCurrentLocation = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, latitude, longitude, setCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;
