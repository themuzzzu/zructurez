
import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";

interface MapDisplayProps {
  onLocationSelect: (location: string) => void;
  searchInput: string;
}

export const MapDisplay = ({ onLocationSelect, searchInput }: MapDisplayProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLIFrameElement>(null);
  const [mapLocation, setMapLocation] = useState("Tadipatri, Andhra Pradesh 515411");

  useEffect(() => {
    // Default location
    const defaultLocation = "Tadipatri, Andhra Pradesh 515411";
    
    // Use searchInput if provided, otherwise use default
    const locationToShow = searchInput || defaultLocation;
    
    // Set the selected location
    onLocationSelect(locationToShow);
    setMapLocation(locationToShow);
    
    // Simulate map loading with a lighter approach
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [onLocationSelect, searchInput]);

  const handleMapLoad = () => {
    setIsLoading(false);
  };

  // Create a Google Maps embed URL from a location string
  const getMapEmbedUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBky_ax9Xw9iNRRWMwbdqXzneYgbO6iarI&q=${encodedLocation}`;
  };

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] rounded-md border bg-gray-50 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-sm text-muted-foreground">Loading map...</p>
          </div>
        )}
        <iframe 
          ref={mapRef}
          src={getMapEmbedUrl(mapLocation)}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy" 
          onLoad={handleMapLoad}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};
