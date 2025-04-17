
import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Loader2, Map } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isMobileDevice } from '@/utils/locationUtils';

interface BusinessLocationSectionProps {
  businessName: string;
  location: string;
}

export const BusinessLocationSection = memo(({
  businessName,
  location
}: BusinessLocationSectionProps) => {
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const isMobile = isMobileDevice();
  const mapRef = useRef<HTMLIFrameElement>(null);
  const mapAttempts = useRef(0);
  const maxAttempts = 2; // Reduced from 3
  const mapTimeoutRef = useRef<number | null>(null);
  
  // Function to encode location and create map URL
  const createMapUrl = useCallback((loc: string) => {
    if (!loc) return '';
    const encodedLocation = encodeURIComponent(loc);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBky_ax9Xw9iNRRWMwbdqXzneYgbO6iarI&q=${encodedLocation}`;
  }, []);
  
  useEffect(() => {
    // Check location permission status on mount
    if (typeof navigator !== 'undefined' && "permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" as PermissionName })
        .then(permissionStatus => {
          setLocationPermission(permissionStatus.state as 'granted' | 'denied' | 'prompt');
          
          // Listen for permission changes
          permissionStatus.onchange = function() {
            setLocationPermission(this.state as 'granted' | 'denied' | 'prompt');
          };
        })
        .catch(error => {
          console.error("Error checking location permission:", error);
          setLocationPermission('unknown');
        });
    }
  }, []);

  // Generate and update the map URL when location changes
  useEffect(() => {
    if (!location) return;
    
    const url = createMapUrl(location);
    setMapUrl(url);
    
    // Set loading to false after a timeout to prevent long loading states
    if (!isMobile) {
      // Desktop should start loading immediately
      setIsMapLoading(true);
    } else {
      // For mobile, only start loading if we have permission
      if (locationPermission === 'granted') {
        setIsMapLoading(true);
      }
    }
    
    // Auto-hide loading indicator after delay
    const timeout = setTimeout(() => {
      setIsMapLoading(false);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [location, createMapUrl, locationPermission, isMobile]);
  
  // Load map with improved performance
  const loadMap = useCallback(() => {
    setIsMapLoading(true);
    setMapError(false);
    mapAttempts.current = 0;
    
    // Clear any existing timeout
    if (mapTimeoutRef.current) {
      clearTimeout(mapTimeoutRef.current);
    }
    
    // Small delay to ensure loading state is shown
    mapTimeoutRef.current = window.setTimeout(() => {
      if (mapRef.current && mapUrl) {
        const cacheBustParam = `&cb=${Date.now()}`;
        mapRef.current.src = mapUrl + cacheBustParam;
      }
    }, 10);
  }, [mapUrl]);
  
  // Creates a Google Maps search URL based on business name and location
  const getGoogleMapsUrl = useCallback(() => {
    const query = encodeURIComponent(`${businessName}, ${location}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [businessName, location]);

  // Handle opening directions in Google Maps
  const openDirections = useCallback(() => {
    window.open(getGoogleMapsUrl(), '_blank');
  }, [getGoogleMapsUrl]);
  
  const handleMapLoad = useCallback(() => {
    setIsMapLoading(false);
    setMapError(false);
    mapAttempts.current = 0;
  }, []);
  
  const handleMapError = useCallback(() => {
    setMapError(true);
    
    // Auto-retry with linear backoff (faster than exponential)
    if (mapAttempts.current < maxAttempts) {
      const retryDelay = 500 * (mapAttempts.current + 1);
      mapAttempts.current += 1;
      
      console.log(`Retrying map load (attempt ${mapAttempts.current}/${maxAttempts}) in ${retryDelay}ms`);
      
      setTimeout(() => {
        if (mapRef.current && mapUrl) {
          setMapError(false);
          // Add cache-busting parameter for each retry
          const cacheBustParam = `&cb=${Date.now()}-${mapAttempts.current}`;
          mapRef.current.src = `${mapUrl}${cacheBustParam}`;
        }
      }, retryDelay);
    }
    
    // Always hide loading state after error
    setIsMapLoading(false);
  }, [mapUrl, maxAttempts]);
  
  const requestLocationPermission = useCallback(() => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermission('granted');
        // Load map after permission granted
        loadMap();
      },
      () => {
        setLocationPermission('denied');
      }
    );
  }, [loadMap]);

  // Cache busting query parameter to help avoid resource errors
  const cacheBustParam = `&cb=${Date.now()}`;
  
  // Don't show map on mobile if location permission is denied
  const shouldShowMap = !isMobile || locationPermission !== 'denied';

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Location</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="break-words">{location}</p>
          </div>
          
          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden relative">
            {isMapLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 z-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            )}
            
            {mapError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted z-10">
                <Map className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Unable to load map</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadMap}
                >
                  Try Again
                </Button>
              </div>
            )}
            
            {isMobile && locationPermission === 'denied' ? (
              <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                <Map className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Location access is required to show the map on mobile devices
                </p>
                <Button size="sm" onClick={requestLocationPermission}>
                  Allow Location Access
                </Button>
                <ScrollArea className="h-16 mt-3 w-full">
                  <p className="text-xs text-muted-foreground px-2">
                    Manual location: {location}
                  </p>
                </ScrollArea>
              </div>
            ) : shouldShowMap && mapUrl ? (
              <iframe 
                ref={mapRef}
                src={`${mapUrl}${cacheBustParam}`}
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                onLoad={handleMapLoad}
                onError={handleMapError}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${businessName} at ${location}`}
              ></iframe>
            ) : null}
          </div>
          
          <Button onClick={openDirections} variant="outline" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
