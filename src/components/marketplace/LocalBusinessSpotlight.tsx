
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LocalBusinessSpotlight = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<string | null>(null);

  // Get approximate location from browser or IP
  useEffect(() => {
    const getLocation = async () => {
      try {
        // Try to get from browser geolocation API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              // For demo purposes, just store the coords
              // In production, you'd use a reverse geocoding API
              const coords = `${position.coords.latitude},${position.coords.longitude}`;
              setUserLocation(coords);
            },
            // If user denies permission or error
            async () => {
              // Fallback to IP-based location
              try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                setUserLocation(data.city || data.region || 'your area');
              } catch (err) {
                console.error('Failed to get location from IP:', err);
                setUserLocation('your area'); // Default fallback
              }
            }
          );
        } else {
          // Fallback for browsers without geolocation
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          setUserLocation(data.city || data.region || 'your area');
        }
      } catch (err) {
        console.error('Error getting location:', err);
        setUserLocation('your area'); // Default fallback
      }
    };

    getLocation();
  }, []);

  // Fetch local businesses
  const { data: localBusinesses = [], isLoading } = useQuery({
    queryKey: ['local-businesses', userLocation],
    queryFn: async () => {
      // In a real app, you would use the location to filter businesses
      // Here we're just fetching recent businesses with a limit
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_open', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data || [];
    },
    enabled: userLocation !== null,
  });

  if (isLoading || localBusinesses.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-red-500" />
        <h2 className="text-xl font-semibold">Local Business Spotlight</h2>
        <span className="text-sm text-muted-foreground">
          {userLocation !== 'your area' ? `Near ${userLocation}` : 'In your area'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {localBusinesses.map((business) => (
          <Card key={business.id} className="overflow-hidden hover:shadow-md transition-all">
            <div className="aspect-video w-full overflow-hidden">
              {business.image_url ? (
                <img 
                  src={business.image_url} 
                  alt={business.name} 
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: business.image_position 
                      ? `${business.image_position.x}% ${business.image_position.y}%` 
                      : 'center'
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                  <span className="text-lg font-medium text-blue-500 dark:text-blue-300">{business.name}</span>
                </div>
              )}
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{business.name}</CardTitle>
                {business.verified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Verified
                  </Badge>
                )}
              </div>
              <CardDescription className="flex items-center text-xs truncate">
                <MapPin className="h-3 w-3 mr-1 inline" />
                {business.location || 'Local business'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="ml-1 text-xs text-muted-foreground">(4.0)</span>
                </div>
                <span className="text-xs text-muted-foreground">{business.category}</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate(`/business/${business.id}`)}
              >
                View Business
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
