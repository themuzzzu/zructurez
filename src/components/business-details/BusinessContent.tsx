
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessAboutSection } from "./content/BusinessAboutSection";
import { BusinessProductsSection } from "./content/BusinessProductsSection";
import { BusinessServicesSection } from "./content/BusinessServicesSection";
import { BusinessReviewsSection } from "./content/BusinessReviewsSection";
import { BusinessLocationSection } from "./content/BusinessLocationSection";
import type { Business, BusinessProduct } from "@/types/business";

interface BusinessContentProps {
  business: Business;
  business_products?: BusinessProduct[];
  business_portfolio?: any[];
  onSuccess?: () => void;
  activeCategory?: string;
  isOwner?: boolean;
}

export const BusinessContent = ({ 
  business, 
  business_products = [], 
  business_portfolio = [],
  onSuccess,
  activeCategory,
  isOwner = false
}: BusinessContentProps) => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="about" className="m-0">
          <BusinessAboutSection business={business} />
        </TabsContent>

        <TabsContent value="products" className="m-0">
          <BusinessProductsSection 
            products={business_products || []} 
            businessId={business.id} 
          />
        </TabsContent>

        <TabsContent value="services" className="m-0">
          <BusinessServicesSection business={business} />
        </TabsContent>

        <TabsContent value="reviews" className="m-0">
          <BusinessReviewsSection businessId={business.id} />
        </TabsContent>

        <TabsContent value="location" className="m-0">
          <BusinessLocationSection 
            businessName={business.name} 
            location={business.location || ""}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};
