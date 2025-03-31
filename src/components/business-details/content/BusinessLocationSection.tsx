
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink } from 'lucide-react';

interface BusinessLocationSectionProps {
  businessName: string;
  location: string;
}

export const BusinessLocationSection = ({
  businessName,
  location
}: BusinessLocationSectionProps) => {
  // Creates a Google Maps search URL based on business name and location
  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(`${businessName}, ${location}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  // Handle opening directions in Google Maps
  const openDirections = () => {
    window.open(getGoogleMapsUrl(), '_blank');
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
          
          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-4">Map view is not available in preview mode</p>
              <Button onClick={openDirections}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Google Maps
              </Button>
            </div>
          </div>
          
          <Button onClick={openDirections} variant="outline" className="w-full">
            Get Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
