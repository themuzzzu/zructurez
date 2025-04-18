
import { Layout } from "@/components/layout/Layout";
import { SearchHero } from "@/components/home/SearchHero";
import { LocationAvailabilityStatus } from "@/components/location/LocationAvailabilityStatus";
import { LocationHeader } from "@/components/home/LocationHeader";
import { HomeBannerAds } from "@/components/home/HomeBannerAds";
import { BusinessCategoryScroller } from "@/components/business/BusinessCategoryScroller";
import { ServiceCategoryScroller } from "@/components/services/ServiceCategoryScroller";
import { MarketplaceCategoryScroller } from "@/components/marketplace/MarketplaceCategoryScroller";
import { FlashSale } from "@/components/marketplace/FlashSale";
import { useLocation } from "@/providers/LocationProvider";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import React, { useState } from "react";
import { CategoryNavigationBar } from "@/components/marketplace/CategoryNavigationBar";

export default function Home() {
  const { currentLocation, isLocationAvailable, setShowLocationPicker } = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeTab, setActiveTab] = useState("business");
  const [gridLayout, setGridLayout] = useState<"grid4x4" | "grid2x2">("grid4x4");
  
  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {!isMobile && <Sidebar className="h-[calc(100vh-4rem)] fixed left-0 top-16" />}
        
        <div className={`container mx-auto px-4 max-w-6xl space-y-8 pb-12 transition-all ${!isMobile ? 'ml-[72px]' : ''}`}>
          <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            <SearchHero />
            
            {/* Banner Ads Section */}
            <HomeBannerAds />
            
            {/* Category Scrollers with improved spacing */}
            <div className="space-y-12">
              {/* Business Categories */}
              <div>
                <BusinessCategoryScroller />
              </div>
              
              {/* Service Categories */}
              <div>
                <ServiceCategoryScroller />
              </div>
              
              {/* Marketplace Categories */}
              <div>
                <MarketplaceCategoryScroller />
              </div>
            </div>

            {/* Flash Deals Section */}
            <div className="mt-12">
              <FlashSale />
            </div>

            {/* Selection Bar and Content */}
            <div className="mt-12 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="business">Businesses</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={gridLayout === "grid4x4" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGridLayout("grid4x4")}
                      className="p-2"
                    >
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-1.5 h-1.5 bg-current rounded-sm" />
                        <div className="w-1.5 h-1.5 bg-current rounded-sm" />
                        <div className="w-1.5 h-1.5 bg-current rounded-sm" />
                        <div className="w-1.5 h-1.5 bg-current rounded-sm" />
                      </div>
                    </Button>
                    <Button
                      variant={gridLayout === "grid2x2" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGridLayout("grid2x2")}
                      className="p-2"
                    >
                      <div className="grid grid-cols-1 gap-0.5">
                        <div className="w-3 h-1.5 bg-current rounded-sm" />
                        <div className="w-3 h-1.5 bg-current rounded-sm" />
                      </div>
                    </Button>
                  </div>
                </div>

                <TabsContent value="business" className="mt-2">
                  <CategoryNavigationBar 
                    categories={["All", "Local", "Featured", "New", "Popular"]}
                  />
                </TabsContent>

                <TabsContent value="services" className="mt-2">
                  <CategoryNavigationBar 
                    categories={["All", "Home", "Professional", "Health", "Education"]}
                  />
                </TabsContent>

                <TabsContent value="products" className="mt-2">
                  <CategoryNavigationBar 
                    categories={["All", "Electronics", "Fashion", "Home", "Beauty"]}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Location Section */}
            <LocationHeader />
            
            {currentLocation !== "All India" && (
              <LocationAvailabilityStatus className="mb-6" />
            )}
            
            {/* Location Picker Call to Action */}
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
