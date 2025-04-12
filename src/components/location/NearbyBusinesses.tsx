
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Navigation, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Business } from '@/types/business';

interface NearbyBusinessesProps {
  className?: string;
}

export function NearbyBusinesses({ className = "" }: NearbyBusinessesProps) {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<string | null>(localStorage.getItem('userLocation'));
  const [userCoordinates, setUserCoordinates] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    // Get user coordinates if available
    const preciseLocationData = localStorage.getItem('userPreciseLocation');
    if (preciseLocationData) {
      try {
        const data = JSON.parse(preciseLocationData);
        if (data.latitude && data.longitude) {
          setUserCoordinates({
            latitude: data.latitude,
            longitude: data.longitude
          });
        }
      } catch (e) {
        console.error("Error parsing precise location data:", e);
      }
    }

    // Listen for location updates
    const handleLocationUpdated = (event: CustomEvent) => {
      if (event.detail.location) {
        setUserLocation(event.detail.location);
      }
      if (event.detail.latitude && event.detail.longitude) {
        setUserCoordinates({
          latitude: event.detail.latitude,
          longitude: event.detail.longitude
        });
      }
    };

    window.addEventListener('locationUpdated', handleLocationUpdated as EventListener);
    
    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdated as EventListener);
    };
  }, []);
  
  // Query for nearby businesses, filtered by location if we have coordinates
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['nearbyBusinesses', userLocation, userCoordinates],
    queryFn: async () => {
      // This is a mock function that would typically use coordinates to filter
      // In a real implementation, you'd use PostGIS or similar to filter by distance
      
      // For now, we'll just filter by the location name
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .limit(6);
      
      if (error) throw error;
      
      // For demo purposes, we'll just return random businesses
      // In a real implementation, you would use the coordinates to filter
      return data || [];
    },
    enabled: !!userLocation
  });
  
  // If we have no location set, don't show this component
  if (!userLocation || userLocation === "All India") {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Nearby Businesses</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={() => navigate('/businesses?filter=nearby')}
          >
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse bg-muted rounded" />
            ))}
          </div>
        ) : businesses && businesses.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {businesses.map((business) => (
              <Button
                key={business.id}
                variant="outline"
                className="h-24 p-2 flex flex-col items-center justify-center text-center"
                onClick={() => navigate(`/business/${business.id}`)}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                  {business.image_url ? (
                    <img 
                      src={business.image_url} 
                      alt={business.name} 
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <MapPin className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className="text-xs font-medium line-clamp-1">{business.name}</span>
                <span className="text-[10px] text-muted-foreground line-clamp-1">{business.category}</span>
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No nearby businesses found</p>
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate('/settings?tab=location')}
            >
              Update your location settings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
