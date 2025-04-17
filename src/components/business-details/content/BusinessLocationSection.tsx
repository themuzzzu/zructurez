
import { useState, useEffect, useRef, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Loader2, Map } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BusinessLocationSectionProps {
  businessName: string;
  location: string;
}

export const BusinessLocationSection = memo(({
  businessName,
  location
}: BusinessLocationSectionProps) => {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const isMobileDevice = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const mapRef = useRef<HTMLIFrameElement>(null);
  const mapAttempts = useRef(0);
  const maxAttempts = 3;
  
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

  useEffect(() => {
    // Generate the map URL when the component mounts or when location changes
    if (!location) return;
    
    const encodedLocation = encodeURIComponent(location);
    setMapUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBky_ax9Xw9iNRRWMwbdqXzneYgbO6iarI&q=${encodedLocation}`);
    
    // Reset map state when location changes
    setIsMapLoading(true);
    setMapError(false);
    mapAttempts.current = 0;
  }, [location]);
  
  // Creates a Google Maps search URL based on business name and location
  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(`${businessName}, ${location}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  // Handle opening directions in Google Maps
  const openDirections = () => {
    window.open(getGoogleMapsUrl(), '_blank');
  };
  
  const handleMapLoad = () => {
    setIsMapLoading(false);
    setMapError(false);
    mapAttempts.current = 0;
  };
  
  const handleMapError = () => {
    setIsMapLoading(false);
    setMapError(true);
    console.error("Map failed to load for location:", location);
    
    // Auto-retry logic with exponential backoff
    if (mapAttempts.current < maxAttempts) {
      const retryDelay = Math.pow(2, mapAttempts.current) * 1000; // Exponential backoff
      mapAttempts.current += 1;
      
      console.log(`Retrying map load (attempt ${mapAttempts.current}/${maxAttempts}) in ${retryDelay}ms`);
      
      setTimeout(() => {
        if (mapRef.current) {
          setIsMapLoading(true);
          setMapError(false);
          // Add cache-busting parameter for each retry
          const cacheBustParam = `&cb=${Date.now()}-${mapAttempts.current}`;
          mapRef.current.src = `${mapUrl}${cacheBustParam}`;
        }
      }, retryDelay);
    }
  };
  
  const requestLocationPermission = () => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermission('granted');
        // Reload the component when permission is granted
        setTimeout(() => {
          setIsMapLoading(true);
          setMapError(false);
          if (mapRef.current) {
            // Add cache-busting parameter
            const cacheBustParam = `&cb=${Date.now()}`;
            mapRef.current.src = `${mapUrl}${cacheBustParam}`;
          }
        }, 500);
      },
      () => {
        setLocationPermission('denied');
      }
    );
  };

  // Cache busting query parameter to help avoid resource errors
  const cacheBustParam = `&cb=${Date.now()}`;
  
  // Don't show map on mobile if location permission is denied
  const shouldShowMap = !isMobileDevice || locationPermission !== 'denied';

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
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted z-10">
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
                  onClick={() => {
                    setIsMapLoading(true);
                    setMapError(false);
                    if (mapRef.current) {
                      const newCacheBustParam = `&cb=${Date.now()}`;
                      mapRef.current.src = `${mapUrl}${newCacheBustParam}`;
                    }
                  }}
                >
                  Try Again
                </Button>
              </div>
            )}
            
            {isMobileDevice && locationPermission === 'denied' ? (
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
            ) : shouldShowMap && mapUrl && (
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
            )}
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

