
import { Suspense, lazy, useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SearchHero } from "@/components/home/SearchHero";
import { PopularCategories } from "@/components/home/PopularCategories";
import { ServiceCategoryScroller } from "@/components/services/ServiceCategoryScroller";
import { BusinessCategoryScroller } from "@/components/business/BusinessCategoryScroller";
import { MarketplaceCategoryScroller } from "@/components/marketplace/MarketplaceCategoryScroller";
import { NotificationPermission } from "@/components/notifications/NotificationPermission";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Map, Navigation, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LocationDisplay } from "@/components/home/LocationDisplay";
import { LocalBusinessSpotlight } from "@/components/marketplace/LocalBusinessSpotlight";
import { NearbyBusinesses } from "@/components/location/NearbyBusinesses";
import { NearMeFilter } from "@/components/location/NearMeFilter";
import { Badge } from "@/components/ui/badge";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocation } from "@/providers/LocationProvider";
import { LocationAvailabilityStatus } from "@/components/location/LocationAvailabilityStatus";

// Lazy-loaded components
const TopRatedBusinesses = lazy(() => import("@/components/home/TopRatedBusinesses"));
const FeaturedBusinesses = lazy(() => import("@/components/home/FeaturedBusinesses"));
const TrendingServices = lazy(() => import("@/components/home/TrendingServices"));
const DealsSection = lazy(() => import("@/components/home/DealsSection"));
const QuickAccessServices = lazy(() => import("@/components/home/QuickAccessServices"));

// Loading fallback component
const SectionSkeleton = () => (
  <div className="space-y-2 w-full">
    <Skeleton className="h-6 w-1/3" />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Skeleton className="h-28 rounded-md" />
      <Skeleton className="h-28 rounded-md" />
      <Skeleton className="hidden sm:block h-28 rounded-md" />
      <Skeleton className="hidden sm:block h-28 rounded-md" />
    </div>
  </div>
);

// Component to show when location is not available
const LocationUnavailableView = () => {
  const { currentLocation, setShowLocationPicker } = useLocation();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-amber-100 dark:bg-amber-900/20 rounded-full p-5 mb-4">
        <MapPin className="h-12 w-12 text-amber-600 dark:text-amber-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Coming Soon to {currentLocation}</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        We're expanding rapidly and will be available in your area soon. 
        In the meantime, you can browse in limited mode or select a different location.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button 
          variant="default" 
          onClick={() => setShowLocationPicker(true)}
        >
          Change Location
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate("/maps")}
        >
          <Map className="h-4 w-4 mr-2" />
          Explore Map
        </Button>
      </div>
    </div>
  );
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nearMeFilter, setNearMeFilter] = useState({ enabled: false, radius: 5 });
  const { requestGeolocation } = useGeolocation();
  const { currentLocation, isLocationAvailable } = useLocation();
  
  const handleNearMeFilterChange = (filter: {enabled: boolean, radius: number}) => {
    setNearMeFilter(filter);
    
    if (filter.enabled) {
      // Request location if we don't have it yet
      requestGeolocation();
    }
  };
  
  // Only show content if we have a location and it's available
  const showFullContent = currentLocation !== "All India";
  
  return (
    <Layout>
      <div className="container mx-auto px-3 space-y-5 pb-12 max-w-7xl">
        {/* Notification Permission Component - only show when user is logged in */}
        {user && <NotificationPermission className="mb-4" />}
        
        {/* Hero Section */}
        <SearchHero />
        
        {/* Location Display */}
        <LocationDisplay className="mb-4" />
        
        {/* Location Availability Status */}
        {currentLocation !== "All India" && (
          <LocationAvailabilityStatus className="mb-4" />
        )}
        
        {showFullContent && !isLocationAvailable ? (
          <LocationUnavailableView />
        ) : showFullContent && (
          <>
            {/* Near Me Filter */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Explore</h2>
                {currentLocation !== "All India" && (
                  <Badge variant="outline" className="font-normal">
                    {currentLocation}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <NearMeFilter 
                  onFilterChange={handleNearMeFilterChange} 
                  compact 
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5"
                  onClick={() => navigate('/maps')}
                >
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">View Map</span>
                </Button>
              </div>
            </div>
            
            {/* Nearby Businesses */}
            <NearbyBusinesses className="mb-4" />
            
            {/* Local Business Spotlight */}
            <LocalBusinessSpotlight />
            
            {/* Business Categories Scroller */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold">Explore Businesses</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-primary flex items-center gap-1"
                  onClick={() => navigate('/businesses?view=categories')}
                >
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              <BusinessCategoryScroller />
            </section>
            
            {/* Marketplace Categories Scroller */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold">Shop Marketplace</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-primary flex items-center gap-1"
                  onClick={() => navigate('/marketplace?view=categories')}
                >
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              <MarketplaceCategoryScroller />
            </section>
            
            {/* Browse Services */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold">Browse Services</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-primary flex items-center gap-1"
                  onClick={() => navigate('/services?view=categories')}
                >
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              <ServiceCategoryScroller />
            </section>
            
            {/* Popular Categories */}
            <PopularCategories />
            
            {/* Top Rated Businesses */}
            <Suspense fallback={<SectionSkeleton />}>
              <TopRatedBusinesses />
            </Suspense>
            
            {/* Featured Businesses */}
            <Suspense fallback={<SectionSkeleton />}>
              <FeaturedBusinesses />
            </Suspense>
            
            {/* Trending Services */}
            <Suspense fallback={<SectionSkeleton />}>
              <TrendingServices />
            </Suspense>
            
            {/* Deals Section */}
            <Suspense fallback={<SectionSkeleton />}>
              <DealsSection />
            </Suspense>
            
            {/* Quick Access Services */}
            <Suspense fallback={<SectionSkeleton />}>
              <QuickAccessServices />
            </Suspense>
          </>
        )}
        
        {/* Show a welcome message if no location is set yet */}
        {currentLocation === "All India" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-full p-5 mb-4">
              <MapPin className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Choose Your Location</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              To see businesses, services and products in your area, 
              please select your location.
            </p>
            <Button onClick={() => navigate('/maps')}>
              <MapPin className="h-4 w-4 mr-2" />
              Set My Location
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
