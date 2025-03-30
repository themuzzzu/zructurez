
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessAboutTab } from "./tabs/BusinessAboutTab";
import { BusinessProductsTab } from "./tabs/BusinessProductsTab";
import { BusinessServicesTab } from "./tabs/BusinessServicesTab";
import { BusinessPortfolioTab } from "./tabs/BusinessPortfolioTab";
import { BusinessPostsTab } from "./tabs/BusinessPostsTab";
import { BusinessBookingsTab } from "./tabs/BusinessBookingsTab";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Business } from "@/types/business";

interface BusinessTabsProps {
  business: Business;
  isOwner: boolean;
  onRefetch: () => void;
}

export const BusinessTabs = ({ business, isOwner, onRefetch }: BusinessTabsProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <Tabs defaultValue="about" className="w-full">
      <div className="relative overflow-hidden rounded-md">
        <ScrollArea className="pb-1">
          <TabsList className="flex w-full min-w-fit">
            <TabsTrigger 
              value="about" 
              className="animate-fade-in transition-all px-4 py-2"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="animate-fade-in transition-all px-4 py-2"
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="services" 
              className="animate-fade-in transition-all px-4 py-2"
            >
              Services
            </TabsTrigger>
            <TabsTrigger 
              value="portfolio" 
              className="animate-fade-in transition-all px-4 py-2"
            >
              Notable Works
            </TabsTrigger>
            <TabsTrigger 
              value="posts" 
              className="animate-fade-in transition-all px-4 py-2"
            >
              Posts
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger 
                value="bookings" 
                className="animate-fade-in transition-all px-4 py-2"
              >
                Bookings
              </TabsTrigger>
            )}
          </TabsList>
        </ScrollArea>
      </div>

      <div className={`mt-6 animate-fade-in transition-all duration-300`}>
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
