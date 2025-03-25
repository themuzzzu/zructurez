
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useBusinessProducts } from "@/hooks/useBusinessProducts";
import type { Business } from "@/types/business";

interface BusinessProductsSectionProps {
  products: Business['business_products'];
  businessId: string;
}

export const BusinessProductsSection = ({ products: initialProducts, businessId }: BusinessProductsSectionProps) => {
  // Use our new hook with caching and real-time updates
  const { data: products, isLoading } = useBusinessProducts(businessId);
  
  // Fallback to initial products if hook data isn't available yet
  const displayProducts = products || initialProducts;
  
  if (!displayProducts?.length) return null;

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayProducts.map((product) => (
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
            <div className="flex justify-between items-center">
              <div className="font-semibold">₹{product.price}</div>
              <StockBadge stock={product.stock} />
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

// Helper component to display stock status
const StockBadge = ({ stock }: { stock: number }) => {
  if (stock <= 0) {
    return <Badge variant="destructive">Out of stock</Badge>;
  } else if (stock < 5) {
    return <Badge variant="outline" className="text-amber-500 border-amber-500">Low stock: {stock}</Badge>;
  } else {
    return <Badge variant="outline" className="text-green-500 border-green-500">In stock: {stock}</Badge>;
  }
};
