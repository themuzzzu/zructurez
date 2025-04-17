
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Store, Star, ArrowRightCircle } from "lucide-react";
import { isMobileDevice } from "@/utils/locationUtils";

interface LocalBusiness {
  id: string;
  name: string;
  description: string;
  image_url?: string | null;
  rating: number;
  distance: number;
  location: string | null;
}

interface BusinessRating {
  rating: number;
}

interface BusinessData {
  id: string;
  name: string;
  description: string;
  image_url?: string | null;
  location: string | null;
  business_ratings?: BusinessRating[];
  [key: string]: any; // Allow other fields
}

export const LocalBusinessSpotlight = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const isDesktopDevice = !isMobileDevice();

  useEffect(() => {
    // For desktop devices, use a default location directly
    if (isDesktopDevice) {
      setUserLocation({ latitude: 14.90409405, longitude: 78.00200075 });
      setLocationPermission('granted');
      return;
    }
    
    // For mobile devices, try to get the user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationPermission('granted');
        },
        () => {
          setLocationPermission('denied');
          // Use default Tadipatri coordinates as fallback
          setUserLocation({ latitude: 14.90409405, longitude: 78.00200075 });
        }
      );
    } else {
      setLocationPermission('denied');
      // Use default Tadipatri coordinates as fallback
      setUserLocation({ latitude: 14.90409405, longitude: 78.00200075 });
    }
  }, [isDesktopDevice]);

  const { data: businessesData = [], isLoading } = useQuery({
    queryKey: ['local-businesses', userLocation],
    queryFn: async () => {
      if (!userLocation) return [];

      const { data, error } = await supabase
        .from('businesses')
        .select('*, business_ratings(*)')
        .limit(4);

      if (error) throw error;
      
      // Transform business data to match LocalBusiness interface
      return data.map((business: BusinessData): LocalBusiness => {
        const ratings = business.business_ratings || [];
        const totalRating = ratings.reduce((sum: number, rating: BusinessRating) => sum + (rating.rating || 0), 0);
        const avgRating = ratings.length > 0 ? totalRating / ratings.length : 0;
        
        return {
          id: business.id,
          name: business.name,
          description: business.description,
          image_url: business.image_url,
          rating: avgRating, 
          distance: Math.round(Math.random() * 10) / 10, // Mock distance
          location: business.location
        };
      });
    },
    enabled: !!userLocation,
  });

  const requestLocationPermission = () => {
    if (isDesktopDevice) {
      // For desktop, just use default location
      setUserLocation({ latitude: 14.90409405, longitude: 78.00200075 });
      setLocationPermission('granted');
      return;
    }
    
    // For mobile devices, try to get precise location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationPermission('granted');
        },
        () => {
          setLocationPermission('denied');
          // Use default location as fallback
          setUserLocation({ latitude: 14.90409405, longitude: 78.00200075 });
        }
      );
    }
  };

  return (
    <div className="my-8 mobile-container">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-semibold">Local Business Spotlight</h2>
        </div>
        <Button variant="link" className="text-blue-600 font-medium flex items-center gap-1">
          View All <ArrowRightCircle size={16} />
        </Button>
      </div>

      {locationPermission === 'pending' && !isDesktopDevice && (
        <Card className="p-6 text-center">
          <p className="mb-4">Allow location access to discover businesses near you</p>
          <Button onClick={requestLocationPermission} className="bg-emerald-600 hover:bg-emerald-700">
            Enable Location
          </Button>
        </Card>
      )}

      {locationPermission === 'denied' && !isDesktopDevice && (
        <Card className="p-6 text-center">
          <p className="mb-2">Location access is required to show nearby businesses</p>
          <p className="text-sm text-muted-foreground mb-4">
            Please enable location services in your browser settings
          </p>
          <Button onClick={requestLocationPermission} variant="outline">
            Try Again
          </Button>
        </Card>
      )}

      {(locationPermission === 'granted' && isLoading) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-40 bg-slate-200 dark:bg-slate-700"></div>
              <div className="p-4">
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {(locationPermission === 'granted' && !isLoading && businessesData.length === 0) && (
        <Card className="p-6 text-center">
          <p className="mb-2">No local businesses found near your location</p>
          <p className="text-sm text-muted-foreground">Try searching in a different area</p>
        </Card>
      )}

      {(locationPermission === 'granted' && !isLoading && businessesData.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {businessesData.map((business: LocalBusiness) => (
            <Card key={business.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
                {business.image_url ? (
                  <img
                    src={business.image_url}
                    alt={business.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900">
                    <Store size={40} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">{business.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm">{business.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin size={14} className="mr-1" />
                    <span>{business.distance}km</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {business.description || "Local business offering quality products and services."}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800 dark:hover:bg-emerald-950"
                >
                  View Business
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
