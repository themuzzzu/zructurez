import { Card } from "@/components/ui/card";
import type { Business } from "@/types/business";

interface BusinessProductsSectionProps {
  products: Business['business_products'];
}

export const BusinessProductsSection = ({ products }: BusinessProductsSectionProps) => {
  if (!products?.length) return null;

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
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
  );
};