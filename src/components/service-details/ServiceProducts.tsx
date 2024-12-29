import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ServiceProductForm } from "./ServiceProductForm";
import { ServiceProductCard } from "./ServiceProductCard";

interface ServiceProductsProps {
  serviceId: string;
  serviceProducts: any[];
  marketplaceProducts: any[];
  onAddToCart: (productId: string) => Promise<void>;
}

export const ServiceProducts = ({ 
  serviceId, 
  serviceProducts, 
  marketplaceProducts,
  onAddToCart 
}: ServiceProductsProps) => {
  const [showProductForm, setShowProductForm] = useState(false);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button onClick={() => setShowProductForm(!showProductForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {showProductForm ? "Cancel" : "Add Product"}
        </Button>
      </div>

      {showProductForm && (
        <ServiceProductForm 
          serviceId={serviceId} 
          onSuccess={() => setShowProductForm(false)} 
        />
      )}

      {(serviceProducts?.length > 0 || marketplaceProducts?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceProducts?.map((product) => (
            <ServiceProductCard
              key={product.id}
              product={product}
              onAddToCart={() => onAddToCart(product.id)}
              type="service"
            />
          ))}
          {marketplaceProducts?.map((product) => (
            <ServiceProductCard
              key={product.id}
              product={product}
              onAddToCart={() => onAddToCart(product.id)}
              type="marketplace"
            />
          ))}
        </div>
      )}
    </Card>
  );
};