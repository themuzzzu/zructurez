import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessAboutTab } from "./tabs/BusinessAboutTab";
import { BusinessProductsTab } from "./tabs/BusinessProductsTab";
import { BusinessServicesTab } from "./tabs/BusinessServicesTab";
import { BusinessStaffTab } from "./tabs/BusinessStaffTab";
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
      <TabsList className="grid grid-cols-6 w-full">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="staff">Staff</TabsTrigger>
        <TabsTrigger value="portfolio">Notable Works</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="about">
          <BusinessAboutTab business={business} />
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

        <TabsContent value="staff">
          <BusinessStaffTab staffDetails={business.staff_details} />
        </TabsContent>

        <TabsContent value="portfolio">
          <BusinessPortfolioTab portfolio={business.business_portfolio} />
        </TabsContent>

        <TabsContent value="posts">
          <BusinessPostsTab business={business} />
        </TabsContent>
      </div>
    </Tabs>
  );
};