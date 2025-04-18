
import { Layout } from "@/components/layout/Layout";
import { SearchHero } from "@/components/home/SearchHero";
import { LocationAvailabilityStatus } from "@/components/location/LocationAvailabilityStatus";
import { LocationHeader } from "@/components/home/LocationHeader";
import { HomeBannerAds } from "@/components/home/HomeBannerAds";
import { BusinessCategoryScroller } from "@/components/business/BusinessCategoryScroller";
import { ServiceCategoryScroller } from "@/components/services/ServiceCategoryScroller";
import { MarketplaceCategoryScroller } from "@/components/marketplace/MarketplaceCategoryScroller";
import { FlashDeals } from "@/components/marketplace/FlashDeals";
import { useLocation } from "@/providers/LocationProvider";
import { MapPin, Grid3X3, ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { CategoryNavigationBar } from "@/components/marketplace/CategoryNavigationBar";
import { BusinessesTabContent } from "@/components/home/BusinessesTabContent";
import { ProductsTabContent } from "@/components/home/ProductsTabContent";
import { ServicesTabContent } from "@/components/home/ServicesTabContent";
import type { GridLayoutType } from "@/components/products/types/ProductTypes";

export default function Home() {
  const { currentLocation, isLocationAvailable, setShowLocationPicker } = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeTab, setActiveTab] = useState("business");
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid4x4");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Available categories for each tab
  const businessCategories = ["All", "Local", "Featured", "New", "Popular"];
  const serviceCategories = ["All", "Home", "Professional", "Health", "Education"];
  const productCategories = ["All", "Electronics", "Fashion", "Home", "Beauty"];
  
  // Get the appropriate categories based on active tab
  const getActiveCategories = () => {
    switch (activeTab) {
      case "business": return businessCategories;
      case "services": return serviceCategories;
      case "products": return productCategories;
      default: return businessCategories;
    }
  };
  
  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {!isMobile && <Sidebar className="h-[calc(100vh-4rem)] fixed left-0 top-16" />}
        
        <div className={`container mx-auto px-4 max-w-6xl space-y-6 md:space-y-8 pb-12 transition-all ${!isMobile ? 'ml-[72px]' : ''}`}>
          <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            <SearchHero />
            
            {/* Banner Ads Section */}
            <HomeBannerAds />
            
            {/* Category Scrollers with improved spacing */}
            <div className="space-y-8 md:space-y-12">
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

            {/* Flash Deals Section - New */}
            <div className="mt-8 md:mt-12">
              <FlashDeals />
            </div>

            {/* Selection Bar and Content */}
            <div className="mt-8 md:mt-12 space-y-6">
              <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                setSelectedCategory("All"); // Reset category when changing tabs
              }} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <TabsList className="h-10">
                    <TabsTrigger value="business" className="px-4">Businesses</TabsTrigger>
                    <TabsTrigger value="services" className="px-4">Services</TabsTrigger>
                    <TabsTrigger value="products" className="px-4">Products</TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={gridLayout === "grid4x4" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGridLayout("grid4x4")}
                      className="p-2"
                      aria-label="Grid view"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={gridLayout === "grid2x2" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGridLayout("grid2x2")}
                      className="p-2"
                      aria-label="List view"
                    >
                      <ListIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Category Navigation for each tab content */}
                <div className="mb-6">
                  <CategoryNavigationBar 
                    categories={getActiveCategories()}
                    activeCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                  />
                </div>

                {/* Tab Content */}
                <TabsContent value="business" className="mt-2">
                  <BusinessesTabContent category={selectedCategory !== "All" ? selectedCategory : undefined} />
                </TabsContent>

                <TabsContent value="services" className="mt-2">
                  <ServicesTabContent category={selectedCategory !== "All" ? selectedCategory : undefined} />
                </TabsContent>

                <TabsContent value="products" className="mt-2">
                  <ProductsTabContent 
                    category={selectedCategory !== "All" ? selectedCategory : undefined} 
                    layout={gridLayout}
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
