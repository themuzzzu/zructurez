
import { useEffect, useState, useRef, useCallback } from "react";
import { Loader2, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isMobileDevice } from "@/utils/locationUtils";

interface MapDisplayProps {
  onLocationSelect: (location: string) => void;
  searchInput: string;
}

export const MapDisplay = ({ onLocationSelect, searchInput }: MapDisplayProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoadError, setMapLoadError] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLIFrameElement>(null);
  const [mapLocation, setMapLocation] = useState("Tadipatri, Andhra Pradesh 515411");
  const isDesktop = !isMobileDevice();
  const mapLoadAttempts = useRef(0);
  const maxMapLoadAttempts = 2; // Reduced from 3 for faster experience
  const permissionPromptShown = useRef(false);
  const mapTimeoutRef = useRef<number | null>(null);

  // Function to create map embed URL
  const getMapEmbedUrl = useCallback((location: string): string => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBky_ax9Xw9iNRRWMwbdqXzneYgbO6iarI&q=${encodedLocation}`;
  }, []);

  // Improved map loading function
  const loadMap = useCallback((location: string) => {
    if (!location) return;
    
    setIsLoading(true);
    setMapLoadError(false);
    
    // Set a timeout for map loading
    if (mapTimeoutRef.current) {
      clearTimeout(mapTimeoutRef.current);
    }
    
    // Use setTimeout to create a non-blocking delay
    mapTimeoutRef.current = window.setTimeout(() => {
      if (mapRef.current) {
        // Add cache busting
        const cacheBust = `&cb=${Date.now()}`;
        mapRef.current.src = getMapEmbedUrl(location) + cacheBust;
      }
    }, 10); // Minimal delay
  }, [getMapEmbedUrl]);

  useEffect(() => {
    // Check location permission status
    const checkPermission = async () => {
      if (typeof navigator !== 'undefined' && "permissions" in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName });
          setLocationPermission(permission.state as 'granted' | 'denied' | 'prompt');
          
          // Listen for permission changes
          permission.onchange = function() {
            setLocationPermission(this.state as 'granted' | 'denied' | 'prompt');
          };
        } catch (error) {
          console.error("Error checking geolocation permission:", error);
          setLocationPermission('unknown');
        }
      }
    };
    
    checkPermission();
  }, []);

  // Handle search input changes
  useEffect(() => {
    if (searchInput) {
      setMapLoadError(false);
      mapLoadAttempts.current = 0;
      loadMap(searchInput);
      onLocationSelect(searchInput);
      setMapLocation(searchInput);
    } else {
      // Use default location if no search input
      const defaultLocation = "Tadipatri, Andhra Pradesh 515411";
      if (!mapLocation) {
        setMapLocation(defaultLocation);
        onLocationSelect(defaultLocation);
      }
    }
  }, [searchInput, onLocationSelect, loadMap, mapLocation]);
  
  // Set a timeout to hide loading indicator if it takes too long
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000); // Max loading time
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleMapLoad = useCallback(() => {
    setIsLoading(false);
    setMapLoadError(false);
    mapLoadAttempts.current = 0;
  }, []);
  
  const handleMapError = useCallback(() => {
    setMapLoadError(true);
    console.error("Map failed to load for location:", mapLocation);
    
    // Auto-retry with linear backoff (faster than exponential)
    if (mapLoadAttempts.current < maxMapLoadAttempts) {
      mapLoadAttempts.current += 1;
      const retryDelay = mapLoadAttempts.current * 500; // Linear backoff
      
      console.log(`Retrying map load (attempt ${mapLoadAttempts.current}/${maxMapLoadAttempts}) in ${retryDelay}ms`);
      
      setTimeout(() => {
        if (mapRef.current) {
          setMapLoadError(false);
          // Add cache-busting parameter with attempt number
          const cacheBuster = `&cb=${Date.now()}-${mapLoadAttempts.current}`;
          mapRef.current.src = getMapEmbedUrl(mapLocation) + cacheBuster;
        }
      }, retryDelay);
    }
    
    // Always hide loading after error (regardless of retries)
    setIsLoading(false);
  }, [mapLocation, getMapEmbedUrl, maxMapLoadAttempts]);

  const requestLocationPermission = useCallback(() => {
    if (!navigator.geolocation) return;
    
    // Mark that we've shown the prompt
    permissionPromptShown.current = true;
    
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermission('granted');
        // Reload to apply new permission, slightly delayed
        setTimeout(() => {
          if (mapRef.current) {
            setMapLoadError(false);
            const cacheBuster = `&cb=${Date.now()}`;
            mapRef.current.src = getMapEmbedUrl(mapLocation) + cacheBuster;
          }
        }, 500);
      },
      () => {
        setLocationPermission('denied');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [mapLocation, getMapEmbedUrl]);

  // Don't auto-request location on desktop devices
  useEffect(() => {
    if (!isDesktop && locationPermission === 'prompt' && !permissionPromptShown.current) {
      const timer = setTimeout(() => {
        requestLocationPermission();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [locationPermission, isDesktop, requestLocationPermission]);

  // Show permission prompt for mobile users
  if (!isDesktop && locationPermission === 'denied') {
    return (
      <div className="space-y-4">
        <div className="w-full h-[250px] rounded-md border bg-gray-50 flex flex-col items-center justify-center text-center p-4">
          <Map className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-muted-foreground mb-4">Location access is required to show the map on mobile devices</p>
          <Button onClick={requestLocationPermission}>
            Allow Location Access
          </Button>
          <ScrollArea className="h-16 mt-4 w-full">
            <p className="text-xs text-muted-foreground px-3">
              Using manual location: {mapLocation}
            </p>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] rounded-md border bg-gray-50 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                setMapLoadError(false);
                if (mapRef.current) {
                  // Add cache-busting parameter
                  const cacheBuster = `&cb=${Date.now()}`;
                  mapRef.current.src = getMapEmbedUrl(mapLocation) + cacheBuster;
                }
              }}
            >
              Try Again
            </Button>
          </div>
        )}
        
        {(!isDesktop && locationPermission === 'denied' ? false : true) && (
          <iframe 
            ref={mapRef}
            src={`${getMapEmbedUrl(mapLocation)}&cb=${Date.now()}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy" 
            onLoad={handleMapLoad}
            onError={handleMapError}
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          />
        )}
      </div>
    </div>
  );
};
