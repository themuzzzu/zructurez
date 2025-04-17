
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Loader2, Map } from 'lucide-react';

interface BusinessLocationSectionProps {
  businessName: string;
  location: string;
}

export const BusinessLocationSection = ({
  businessName,
  location
}: BusinessLocationSectionProps) => {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const isMobileDevice = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  useEffect(() => {
    // Check location permission status on mount
    if (typeof navigator !== 'undefined' && "permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" as PermissionName })
        .then(permissionStatus => {
          setLocationPermission(permissionStatus.state as 'granted' | 'denied' | 'prompt');
        })
        .catch(error => {
          console.error("Error checking location permission:", error);
          setLocationPermission('unknown');
        });
    }
  }, []);

  useEffect(() => {
    // Generate the map URL when the component mounts or when location changes
    const encodedLocation = encodeURIComponent(location);
    setMapUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBky_ax9Xw9iNRRWMwbdqXzneYgbO6iarI&q=${encodedLocation}`);
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
  };
  
  const handleMapError = () => {
    setIsMapLoading(false);
    setMapError(true);
    console.error("Map failed to load for location:", location);
  };
  
  const requestLocationPermission = () => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermission('granted');
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
            <p>{location}</p>
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
                <p className="text-xs text-muted-foreground mt-3">
                  Manual location: {location}
                </p>
              </div>
            ) : shouldShowMap && mapUrl && (
              <iframe 
                src={`${mapUrl}${cacheBustParam}`}
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                onLoad={handleMapLoad}
                onError={handleMapError}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
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
};
