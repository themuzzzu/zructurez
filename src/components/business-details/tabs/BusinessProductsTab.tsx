import { BusinessContent } from "@/components/business-details/BusinessContent";
import type { Business } from "@/types/business";

interface BusinessProductsTabProps {
  businessId: string;
  isOwner: boolean;
  products: Business['business_products'];
  onSuccess: () => void;
}

export const BusinessProductsTab = ({ businessId, isOwner, products, onSuccess }: BusinessProductsTabProps) => {
  return (
    <BusinessContent
      businessId={businessId}
      isOwner={isOwner}
      business_products={products}
      business_portfolio={[]}
      onSuccess={onSuccess}
    />
  );
};