
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { Business, BusinessProduct } from "@/types/business";
import { BusinessProductsSection } from "./content/BusinessProductsSection";

interface BusinessContentProps {
  business: Business;
  business_products?: BusinessProduct[];
  business_portfolio?: any[];
  onSuccess?: () => void;
  activeCategory?: string;
}

export const BusinessContent: React.FC<BusinessContentProps> = ({
  business,
  business_products,
  business_portfolio,
  onSuccess,
  activeCategory
}) => {
  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsContent value="products" className="mt-0">
        <BusinessProductsSection 
          products={business_products || []} 
          businessId={business.id}
          activeCategory={activeCategory}
        />
      </TabsContent>
    </Tabs>
  );
};
