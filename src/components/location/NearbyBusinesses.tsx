
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/providers/LocationProvider";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MapPin, Navigation, Store, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface NearbyBusinessesProps {
  className?: string;
  radius?: number;
}

interface Business {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
}

export function NearbyBusinesses({ className = "", radius = 5 }: NearbyBusinessesProps) {
  const navigate = useNavigate();
  const [maxDistance, setMaxDistance] = useState(radius); // in kilometers
  const { currentLocation, latitude, longitude, isLocationAvailable } = useLocation();
  const { getDistanceBetweenCoordinates, requestGeolocation } = useGeolocation();
  
  // Skip if location is not available or we don't have coordinates
  const enabled = isLocationAvailable && !!latitude && !!longitude;
  
  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['nearbyBusinesses', latitude, longitude, maxDistance],
    queryFn: async () => {
      if (!latitude || !longitude) return [];
      
      try {
        // Query businesses within specified radius
        const { data, error } = await supabase
          .from('businesses')
          .select('id, name, description, image_url, category, latitude, longitude')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .order('name');
        
        if (error) {
          console.error("Error fetching businesses:", error);
          return [];
        }
        
        if (!data || data.length === 0) return [];
        
        // Filter out entries without proper coordinates
        const validBusinesses = data.filter(business => 
          typeof business.latitude === 'number' && 
          typeof business.longitude === 'number'
        );
        
        // Calculate distance for each business and filter by radius
        const businessesWithDistance = validBusinesses.map(business => {
          const distance = getDistanceBetweenCoordinates(
            latitude, 
            longitude, 
            business.latitude!, 
            business.longitude!
          );
          
          return { 
            ...business, 
            distance 
          };
        })
        .filter(b => b.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
        
        return businessesWithDistance.slice(0, 10); // Limit to 10 nearest
      } catch (error) {
        console.error("Error processing businesses:", error);
        return [];
      }
    },
    enabled
  });
  
  const handleRetryLocation = () => {
    requestGeolocation();
    toast.info("Detecting your location...");
  };
  
  if (!enabled) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="font-medium mb-1">Location Required</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Allow location access to see nearby businesses
            </p>
            <Button size="sm" onClick={handleRetryLocation}>
              <Navigation className="h-4 w-4 mr-2" />
              Detect Location
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 w-40 bg-muted rounded"></div>
              <div className="h-3 w-60 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (businesses.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Store className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="font-medium">No Nearby Businesses</h3>
          <p className="text-sm text-muted-foreground">
            We couldn't find any businesses within {maxDistance}km of your location.
          </p>
          <Button 
            variant="link" 
            size="sm"
            onClick={() => setMaxDistance(prev => prev + 5)}
          >
            Expand search radius to {maxDistance + 5}km
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Nearby Businesses</h2>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-sm text-primary"
          onClick={() => navigate('/maps')}
        >
          View Map
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <ScrollArea className="w-full pb-4">
        <div className="flex space-x-4">
          {businesses.map((business) => (
            <Card
              key={business.id}
              className="w-[250px] shrink-0 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => navigate(`/businesses/${business.id}`)}
            >
              <CardContent className="p-4">
                <div className="aspect-[4/3] mb-3 relative overflow-hidden rounded-md">
                  {business.image_url ? (
                    <img 
                      src={business.image_url} 
                      alt={business.name} 
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <Store className="h-10 w-10 text-muted-foreground opacity-40" />
                    </div>
                  )}
                </div>
                
                <h3 className="font-medium line-clamp-1">{business.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                  {business.description}
                </p>
                
                {business.distance !== undefined && (
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{business.distance.toFixed(1)} km away</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
