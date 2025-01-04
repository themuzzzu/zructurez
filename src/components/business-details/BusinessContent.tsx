import { Card } from "@/components/ui/card";
import { BusinessOfferings } from "./BusinessOfferings";

interface BusinessContentProps {
  businessId: string;
  isOwner: boolean;
  business_products: any[];
  business_portfolio: any[];
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

      {business_products && business_products.length > 0 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {business_products.map((product) => (
              <Card key={product.id} className="p-4 space-y-2">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="font-semibold">₹{product.price}</div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {business_portfolio && business_portfolio.length > 0 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {business_portfolio.map((item) => (
              <Card key={item.id} className="p-4 space-y-2">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};