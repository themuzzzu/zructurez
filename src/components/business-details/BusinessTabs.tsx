import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessAboutTab } from "./tabs/BusinessAboutTab";
import { BusinessProductsTab } from "./tabs/BusinessProductsTab";
import { BusinessServicesTab } from "./tabs/BusinessServicesTab";
import { BusinessPortfolioTab } from "./tabs/BusinessPortfolioTab";
import { BusinessPostsTab } from "./tabs/BusinessPostsTab";
import type { Business } from "@/types/business";

interface BusinessTabsProps {
  business: Business;
  isOwner: boolean;
  onRefetch: () => void;
}

export const BusinessTabs = ({ business, isOwner, onRefetch }: BusinessTabsProps) => {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="portfolio">Notable Works</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="about">
          <BusinessAboutTab business={business} />
        </TabsContent>

        <TabsContent value="posts">
          <BusinessPostsTab business={business} />
        </TabsContent>

        <TabsContent value="portfolio">
          <BusinessPortfolioTab portfolio={business.business_portfolio} />
        </TabsContent>

        <TabsContent value="products">
          <BusinessProductsTab
            businessId={business.id}
            isOwner={isOwner}
            products={business.business_products}
            onSuccess={onRefetch}
          />
        </TabsContent>

        <TabsContent value="services">
          <BusinessServicesTab
            appointmentPrice={business.appointment_price}
            consultationPrice={business.consultation_price}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};