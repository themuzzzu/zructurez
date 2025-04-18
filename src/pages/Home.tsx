
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SearchHero } from "@/components/home/SearchHero";
import { LocationAvailabilityStatus } from "@/components/location/LocationAvailabilityStatus";
import { LocationHeader } from "@/components/home/LocationHeader";
import { EmptyLocationState } from "@/components/home/EmptyLocationState";
import { useLocation } from "@/providers/LocationProvider";

export default function Home() {
  const { currentLocation, isLocationAvailable } = useLocation();
  const [searchRadius, setSearchRadius] = useState(5);
  
  const handleExpandRadius = () => {
    setSearchRadius(prev => prev + 5);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-6xl space-y-6 pb-12">
        {/* Hero Section */}
        <SearchHero />
        
        {/* Location Header */}
        <LocationHeader />
        
        {/* Location Status */}
        {currentLocation !== "All India" && (
          <LocationAvailabilityStatus className="mb-6" />
        )}
        
        {/* Main Content */}
        {currentLocation !== "All India" && isLocationAvailable ? (
          <div className="space-y-8">
            <EmptyLocationState onExpandRadius={handleExpandRadius} />
          </div>
        ) : null}
        
        {/* Welcome Message for New Users */}
        {currentLocation === "All India" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-5 mb-4">
              <MapPin className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Zructures</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              To discover businesses and services in your area, 
              please select your location to get started.
            </p>
            <Button onClick={() => setShowLocationPicker(true)}>
              Set My Location
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
