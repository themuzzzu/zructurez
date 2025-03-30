
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessAboutTab } from "./tabs/BusinessAboutTab";
import { BusinessProductsTab } from "./tabs/BusinessProductsTab";
import { BusinessServicesTab } from "./tabs/BusinessServicesTab";
import { BusinessPortfolioTab } from "./tabs/BusinessPortfolioTab";
import { BusinessPostsTab } from "./tabs/BusinessPostsTab";
import { BusinessBookingsTab } from "./tabs/BusinessBookingsTab";
import { BusinessPhotosTab } from "./tabs/BusinessPhotosTab";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import type { Business } from "@/types/business";

interface BusinessTabsProps {
  business: Business;
  isOwner: boolean;
  onRefetch: () => void;
}

export const BusinessTabs = ({ business, isOwner, onRefetch }: BusinessTabsProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeTab, setActiveTab] = useState("about");
  
  // Track tab views for analytics
  useEffect(() => {
    if (!isOwner && business.id) {
      // Here you would call a function to track which tab was viewed
      console.log(`Business tab viewed: ${activeTab} for business ${business.id}`);
      // You could implement trackBusinessTabView(business.id, activeTab) similar to other tracking functions
    }
  }, [activeTab, business.id, isOwner]);
  
  return (
    <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
      <div className="relative rounded-md border border-border/30">
        <ScrollArea className="pb-1">
          <TabsList className="flex w-full min-w-fit justify-between px-1 py-1 rounded-none bg-transparent">
            <TabsTrigger 
              value="about" 
              className="flex-1 animate-fade-in transition-all px-3 py-2 text-xs sm:text-sm rounded-md"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="flex-1 animate-fade-in transition-all px-3 py-2 text-xs sm:text-sm rounded-md"
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="services" 
              className="flex-1 animate-fade-in transition-all px-3 py-2 text-xs sm:text-sm rounded-md"
            >
              Services
            </TabsTrigger>
            <TabsTrigger 
              value="portfolio" 
              className="flex-1 animate-fade-in transition-all px-3 py-2 text-xs sm:text-sm rounded-md"
            >
              Notable Works
            </TabsTrigger>
            <TabsTrigger 
              value="photos" 
              className="flex-1 animate-fade-in transition-all px-3 py-2 text-xs sm:text-sm rounded-md"
            >
              Photos
            </TabsTrigger>
            <TabsTrigger 
              value="posts" 
              className="flex-1 animate-fade-in transition-all px-3 py-2 text-xs sm:text-sm rounded-md"
            >
              Posts
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger 
                value="bookings" 
                className="flex-1 animate-fade-in transition-all px-3 py-2 text-xs sm:text-sm rounded-md"
              >
                Bookings
              </TabsTrigger>
            )}
          </TabsList>
        </ScrollArea>
      </div>

      <div className="mt-6 animate-fade-in transition-all duration-300 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide">
        <TabsContent value="about" className="animate-scale-in">
          <BusinessAboutTab business={business} />
        </TabsContent>

        <TabsContent value="products" className="animate-scale-in">
          <BusinessProductsTab
            businessId={business.id}
            isOwner={isOwner}
            products={business.business_products}
            onSuccess={onRefetch}
          />
        </TabsContent>

        <TabsContent value="services" className="animate-scale-in">
          <BusinessServicesTab
            appointmentPrice={business.appointment_price}
            consultationPrice={business.consultation_price}
            businessId={business.id}
            onSuccess={onRefetch}
          />
        </TabsContent>

        <TabsContent value="portfolio" className="animate-scale-in">
          <BusinessPortfolioTab 
            portfolio={business.business_portfolio} 
            businessId={isOwner ? business.id : undefined}
          />
        </TabsContent>

        <TabsContent value="photos" className="animate-scale-in">
          <BusinessPhotosTab
            businessId={isOwner ? business.id : undefined}
            businessName={business.name}
          />
        </TabsContent>

        <TabsContent value="posts" className="animate-scale-in">
          <BusinessPostsTab business={business} />
        </TabsContent>

        {isOwner && (
          <TabsContent value="bookings" className="animate-scale-in">
            <BusinessBookingsTab businessId={business.id} />
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
};
