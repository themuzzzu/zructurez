
import { Layout } from "@/components/layout/Layout";
import { SearchHero } from "@/components/home/SearchHero";
import { LocationAvailabilityStatus } from "@/components/location/LocationAvailabilityStatus";
import { LocationHeader } from "@/components/home/LocationHeader";
import { HomeBannerAds } from "@/components/home/HomeBannerAds";
import { BusinessCategoryScroller } from "@/components/business/BusinessCategoryScroller";
import { ServiceCategoryScroller } from "@/components/services/ServiceCategoryScroller";
import { MarketplaceCategoryScroller } from "@/components/marketplace/MarketplaceCategoryScroller";
import { useLocation } from "@/providers/LocationProvider";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Home() {
  const { currentLocation, isLocationAvailable, setShowLocationPicker } = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {!isMobile && <Sidebar className="h-[calc(100vh-4rem)] fixed left-0 top-16" />}
        
        <div className={`container mx-auto px-4 max-w-6xl space-y-6 pb-12 transition-all ${!isMobile ? 'ml-[72px]' : ''}`}>
          <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            <SearchHero />
            
            <div className="-mt-4">
              <HomeBannerAds />
            </div>
            
            {/* Category Scrollers */}
            <div className="space-y-4">
              <BusinessCategoryScroller />
              <ServiceCategoryScroller />
              <MarketplaceCategoryScroller />
            </div>
            
            {/* Location Section */}
            <LocationHeader />
            
            {currentLocation !== "All India" && (
              <LocationAvailabilityStatus className="mb-6" />
            )}
            
            {currentLocation === "All India" && (
              <div className="flex-1 flex flex-col items-center justify-center py-8 sm:py-16 text-center">
                <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-5 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <MapPin className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                  Welcome to Zructures
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                  To discover businesses and services in your area, 
                  please select your location to get started.
                </p>
                <Button 
                  onClick={() => setShowLocationPicker(true)}
                  size="lg"
                  className="h-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-450"
                >
                  Set My Location
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
