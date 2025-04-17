
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Loader2 } from 'lucide-react';

interface BusinessLocationSectionProps {
  businessName: string;
  location: string;
}

export const BusinessLocationSection = ({
  businessName,
  location
}: BusinessLocationSectionProps) => {
  const [isMapLoading, setIsMapLoading] = useState(true);
  
  // Creates a Google Maps search URL based on business name and location
  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(`${businessName}, ${location}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  // Get a static map URL for the given location
  const getStaticMapUrl = () => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBky_ax9Xw9iNRRWMwbdqXzneYgbO6iarI&q=${encodedLocation}`;
  };

  // Handle opening directions in Google Maps
  const openDirections = () => {
    window.open(getGoogleMapsUrl(), '_blank');
  };
  
  const handleMapLoad = () => {
    setIsMapLoading(false);
  };

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
            
            <iframe 
              src={getStaticMapUrl()}
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              onLoad={handleMapLoad}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
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
