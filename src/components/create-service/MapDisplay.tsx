
import { useEffect, useState, useRef } from "react";
import { Loader2, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapDisplayProps {
  onLocationSelect: (location: string) => void;
  searchInput: string;
}

export const MapDisplay = ({ onLocationSelect, searchInput }: MapDisplayProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoadError, setMapLoadError] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLIFrameElement>(null);
  const [mapLocation, setMapLocation] = useState("Tadipatri, Andhra Pradesh 515411");
  const isMobileDevice = window.innerWidth < 768;

  useEffect(() => {
    // Check location permission status
    const checkPermission = async () => {
      if (!("permissions" in navigator)) {
        setLocationPermission('unknown');
        return;
      }
      
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        setLocationPermission(permission.state as 'granted' | 'denied' | 'prompt');
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
        setLocationPermission('unknown');
      }
    };
    
    checkPermission();
  }, []);

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
    setMapLoadError(false);
  };
  
  const handleMapError = () => {
    setIsLoading(false);
    setMapLoadError(true);
  };

  const requestLocationPermission = () => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermission('granted');
        window.location.reload(); // Refresh to apply new permission
      },
      () => {
        setLocationPermission('denied');
      }
    );
  };

  // Create a Google Maps embed URL from a location string
  const getMapEmbedUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBky_ax9Xw9iNRRWMwbdqXzneYgbO6iarI&q=${encodedLocation}`;
  };

  // Don't show map on mobile if location permission is denied
  const shouldShowMap = !isMobileDevice || locationPermission !== 'denied';

  // Show permission prompt for mobile users
  if (isMobileDevice && locationPermission === 'denied') {
    return (
      <div className="space-y-4">
        <div className="w-full h-[250px] rounded-md border bg-gray-50 flex flex-col items-center justify-center text-center p-4">
          <Map className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-muted-foreground mb-4">Location access is required to show the map on mobile devices</p>
          <Button onClick={requestLocationPermission}>
            Allow Location Access
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Using manual location: {mapLocation}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] rounded-md border bg-gray-50 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-sm text-muted-foreground">Loading map...</p>
          </div>
        )}
        
        {mapLoadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
            <Map className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-muted-foreground">Unable to load map</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                setIsLoading(true);
                setMapLoadError(false);
                if (mapRef.current) {
                  mapRef.current.src = getMapEmbedUrl(mapLocation);
                }
              }}
            >
              Try Again
            </Button>
          </div>
        )}
        
        {shouldShowMap && (
          <iframe 
            ref={mapRef}
            src={getMapEmbedUrl(mapLocation)}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy" 
            onLoad={handleMapLoad}
            onError={handleMapError}
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </div>
  );
};
