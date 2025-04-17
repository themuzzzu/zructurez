
import React, { useEffect, useState } from 'react';
import { useLocation } from "@/providers/LocationProvider";
import { Dialog } from "@/components/ui/dialog";
import { LocationPickerModal } from "./LocationPickerModal";

export const LocationModalHandler = () => {
  // State to control the location picker dialog
  const [isOpen, setIsOpen] = useState(false);
  const { setLocation, currentLocation } = useLocation();

  // Create a custom function to handle showLocationPicker
  // This works around the missing showLocationPicker property in useLocation
  useEffect(() => {
    // Custom event listener for showing the location picker
    const handleShowLocationPicker = () => {
      setIsOpen(true);
    };

    // Listen for the custom event
    window.addEventListener('show-location-picker', handleShowLocationPicker);

    // Check if this is the first visit
    const isFirstVisit = localStorage.getItem('firstVisit') !== 'false';
    if (isFirstVisit && currentLocation === "All India") {
      setIsOpen(true);
      localStorage.setItem('firstVisit', 'false');
    }

    return () => {
      window.removeEventListener('show-location-picker', handleShowLocationPicker);
    };
  }, [currentLocation]);

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setLocation(location);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <LocationPickerModal 
        onLocationSelect={handleLocationSelect}
        onClose={() => setIsOpen(false)}
      />
    </Dialog>
  );
};

export default LocationModalHandler;
