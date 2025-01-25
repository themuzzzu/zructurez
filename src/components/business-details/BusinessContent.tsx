import { BusinessOfferings } from "./BusinessOfferings";
import { BusinessProductsSection } from "./content/BusinessProductsSection";
import { BusinessPortfolioSection } from "./content/BusinessPortfolioSection";
import type { Business } from "@/types/business";

interface BusinessContentProps {
  businessId: string;
  isOwner: boolean;
  business_products: Business['business_products'];
  business_portfolio: Business['business_portfolio'];
  onSuccess?: () => void;
}

export const BusinessContent = ({
  businessId,
  isOwner,
  business_products,
  business_portfolio,
  onSuccess
}: BusinessContentProps) => {
  return (
    <div className="space-y-6">
      {isOwner && (
        <BusinessOfferings 
          businessId={businessId} 
          onSuccess={onSuccess}
        />
      )}

      <BusinessProductsSection products={business_products} />
      <BusinessPortfolioSection portfolio={business_portfolio} />
    </div>
  );
};