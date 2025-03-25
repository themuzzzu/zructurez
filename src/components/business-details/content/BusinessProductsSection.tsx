
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, memo } from "react";
import { useBusinessProducts } from "@/hooks/useBusinessProducts";
import { fetchWithPerformance, preloadImages } from "@/utils/apiPerformance";
import type { Business } from "@/types/business";
import { Skeleton } from "@/components/ui/skeleton";

interface BusinessProductsSectionProps {
  products: Business['business_products'];
  businessId: string;
}

// Memoized component for product cards to prevent unnecessary re-renders
const ProductCard = memo(({ product }: { product: Business['business_products'][0] }) => {
  return (
    <Card key={product.id} className="p-4 space-y-2">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
          loading="lazy"
          decoding="async"
        />
      )}
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-muted-foreground">{product.description}</p>
      <div className="flex justify-between items-center">
        <div className="font-semibold">₹{product.price}</div>
        <StockBadge stock={product.stock} />
      </div>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

// Helper component to display stock status
const StockBadge = memo(({ stock }: { stock: number }) => {
  if (stock <= 0) {
    return <Badge variant="destructive">Out of stock</Badge>;
  } else if (stock < 5) {
    return <Badge variant="outline" className="text-amber-500 border-amber-500">Low stock: {stock}</Badge>;
  } else {
    return <Badge variant="outline" className="text-green-500 border-green-500">In stock: {stock}</Badge>;
  }
});

StockBadge.displayName = 'StockBadge';

export const BusinessProductsSection = ({ products: initialProducts, businessId }: BusinessProductsSectionProps) => {
  // Use our enhanced hook with caching and real-time updates
  const { data: products, isLoading } = useBusinessProducts(businessId);
  
  // Fallback to initial products if hook data isn't available yet
  const displayProducts = products || initialProducts;
  
  // Preload product images for better UX
  useEffect(() => {
    if (displayProducts?.length) {
      const imageUrls = displayProducts
        .filter(product => product.image_url)
        .map(product => product.image_url as string);
      
      // Preload the images in the background
      preloadImages(imageUrls);
    }
  }, [displayProducts]);
  
  if (!displayProducts?.length) return null;

  // Rendering optimization using memo and virtualization concepts
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          // Skeleton loading state
          Array(4).fill(0).map((_, i) => (
            <Card key={`skeleton-${i}`} className="p-4 space-y-2">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </Card>
          ))
        ) : (
          // Actual product cards
          displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </Card>
  );
};
