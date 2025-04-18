
import { Layout } from "@/components/layout/Layout";
import { SearchHero } from "@/components/home/SearchHero";
import { LocationAvailabilityStatus } from "@/components/location/LocationAvailabilityStatus";
import { LocationHeader } from "@/components/home/LocationHeader";
import { HomeCategories } from "@/components/home/HomeCategories";
import { HomeBannerAds } from "@/components/home/HomeBannerAds";
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
        {/* Sidebar - Only shown on desktop */}
        {!isMobile && <Sidebar className="h-[calc(100vh-4rem)] fixed left-0 top-16" />}
        
        {/* Main Content */}
        <div className={`container mx-auto px-4 max-w-6xl space-y-6 pb-12 transition-all ${!isMobile ? 'ml-[72px]' : ''}`}>
          <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            {/* Hero Section */}
            <SearchHero />
            
            {/* Banner Ads Section */}
            <div className="mb-8">
              <HomeBannerAds />
            </div>
            
            {/* Categories Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
              <HomeCategories />
            </div>
            
            {/* Location Header */}
            <LocationHeader />
            
            {/* Location Status */}
            {currentLocation !== "All India" && (
              <LocationAvailabilityStatus className="mb-6" />
            )}
            
            {/* Welcome Message for New Users */}
            {currentLocation === "All India" && (
              <div className="flex-1 flex flex-col items-center justify-center py-8 sm:py-16 text-center">
                <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-5 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <MapPin className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">Welcome to Zructures</h2>
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
