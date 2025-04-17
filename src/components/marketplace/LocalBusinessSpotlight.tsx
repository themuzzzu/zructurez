
import { useState, useEffect, useCallback, memo, Suspense, lazy, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Store, Star, ArrowRightCircle, Map } from "lucide-react";
import { isMobileDevice } from "@/utils/locationUtils";
import { useGeolocation } from "@/hooks/useGeolocation";

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

const BusinessCard = memo(({ business }: { business: LocalBusiness }) => (
  <Card key={business.id} className="overflow-hidden transition-all hover:shadow-lg">
    <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
      {business.image_url ? (
        <img
          src={business.image_url}
          alt={business.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
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
));

const BusinessLoadingPlaceholder = () => (
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
);

export const LocalBusinessSpotlight = () => {
  const { position, requestGeolocation, permissionStatus } = useGeolocation();
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const isDesktopDevice = !isMobileDevice();
  const permissionPromptShown = useRef(false);

  useEffect(() => {
    if (permissionStatus !== 'unknown') {
      setLocationPermission(permissionStatus);
    }
  }, [permissionStatus]);

  const effectiveCoordinates = position || 
    (isDesktopDevice ? { latitude: 14.90409405, longitude: 78.00200075 } : null);

  const { data: businessesData = [], isLoading } = useQuery({
    queryKey: ['local-businesses', effectiveCoordinates?.latitude, effectiveCoordinates?.longitude],
    queryFn: async () => {
      if (!effectiveCoordinates) return [];

      const { data, error } = await supabase
        .from('businesses')
        .select('*, business_ratings(*)')
        .limit(4);

      if (error) throw error;
      
      return data.map((business: BusinessData): LocalBusiness => {
        const ratings = business.business_ratings || [];
        const totalRating = ratings.reduce((sum: number, rating: BusinessRating) => sum + (rating.rating || 0), 0);
        const avgRating = ratings.length > 0 ? totalRating / ratings.length : 0;
        
        let distance = Math.round(Math.random() * 10) / 10; // Default mock distance
        
        if (effectiveCoordinates && business.latitude && business.longitude) {
          const R = 6371; // Earth radius in km
          const dLat = (business.latitude - effectiveCoordinates.latitude) * Math.PI / 180;
          const dLon = (business.longitude - effectiveCoordinates.longitude) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(effectiveCoordinates.latitude * Math.PI / 180) * 
            Math.cos(business.latitude * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          distance = Math.round((R * c) * 10) / 10; // Round to 1 decimal place
        }
        
        return {
          id: business.id,
          name: business.name,
          description: business.description,
          image_url: business.image_url,
          rating: avgRating, 
          distance: distance,
          location: business.location
        };
      });
    },
    enabled: !!effectiveCoordinates,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!isDesktopDevice && 
        locationPermission === 'prompt' && 
        !permissionPromptShown.current) {
      const timer = setTimeout(() => {
        requestGeolocation();
        permissionPromptShown.current = true;
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [locationPermission, isDesktopDevice, requestGeolocation]);

  const handleRequestLocation = useCallback(() => {
    requestGeolocation();
  }, [requestGeolocation]);

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

      {!isDesktopDevice && locationPermission === 'prompt' && (
        <Card className="p-6 text-center">
          <p className="mb-4">Allow location access to discover businesses near you</p>
          <Button onClick={handleRequestLocation} className="bg-emerald-600 hover:bg-emerald-700">
            Enable Location
          </Button>
        </Card>
      )}

      {!isDesktopDevice && locationPermission === 'denied' && (
        <Card className="p-6 text-center">
          <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="mb-2">Location access is required to show nearby businesses</p>
          <p className="text-sm text-muted-foreground mb-4">
            Please enable location services in your browser settings
          </p>
          <Button onClick={handleRequestLocation} variant="outline">
            Try Again
          </Button>
        </Card>
      )}

      {((isDesktopDevice || locationPermission === 'granted') && isLoading) && (
        <Suspense fallback={<BusinessLoadingPlaceholder />}>
          <BusinessLoadingPlaceholder />
        </Suspense>
      )}

      {((isDesktopDevice || locationPermission === 'granted') && !isLoading && businessesData.length === 0) && (
        <Card className="p-6 text-center">
          <p className="mb-2">No local businesses found near your location</p>
          <p className="text-sm text-muted-foreground">Try searching in a different area</p>
        </Card>
      )}

      {((isDesktopDevice || locationPermission === 'granted') && !isLoading && businessesData.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {businessesData.map((business: LocalBusiness) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
};
