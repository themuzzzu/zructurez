
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
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LocationDisplay } from "@/components/home/LocationDisplay";
import { LocalBusinessSpotlight } from "@/components/marketplace/LocalBusinessSpotlight";

// Lazy-loaded components - moved from eager loading to lazy loading
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

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasLocation, setHasLocation] = useState(false);
  
  useEffect(() => {
    const location = localStorage.getItem('userLocation');
    setHasLocation(!!location && location !== "All India");
  }, []);
  
  // Listen for location updates
  useEffect(() => {
    const handleLocationUpdated = (event: CustomEvent) => {
      setHasLocation(!!event.detail.location && event.detail.location !== "All India");
    };

    window.addEventListener('locationUpdated', handleLocationUpdated as EventListener);
    
    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdated as EventListener);
    };
  }, []);
  
  return (
    <Layout>
      <div className="container mx-auto px-3 space-y-5 pb-12 max-w-7xl">
        {/* Notification Permission Component - only show when user is logged in */}
        {user && <NotificationPermission className="mb-4" />}
        
        {/* Hero Section */}
        <SearchHero />
        
        {/* Location Display */}
        <LocationDisplay className="mb-4" />
        
        {/* Show local business spotlight when a specific location is set */}
        {hasLocation && <LocalBusinessSpotlight />}
        
        {/* Business Categories Scroller - Horizontal scroll layout */}
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
        
        {/* Marketplace Categories Scroller - New addition below business categories */}
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
        
        {/* Top Rated Businesses - Now lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <TopRatedBusinesses />
        </Suspense>
        
        {/* Featured Businesses - Now lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedBusinesses />
        </Suspense>
        
        {/* Trending Services - Now lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <TrendingServices />
        </Suspense>
        
        {/* Deals Section - Now lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <DealsSection />
        </Suspense>
        
        {/* Quick Access Services - Now lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <QuickAccessServices />
        </Suspense>
      </div>
    </Layout>
  );
}
