
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, memo } from "react";
import { useBusinessProducts } from "@/hooks/useBusinessProducts";
import { fetchWithPerformance, preloadImages } from "@/utils/apiPerformance";
import type { Business } from "@/types/business";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "lucide-react";

interface BusinessProductsSectionProps {
  products: Business['business_products'];
  businessId: string;
  activeCategory?: string;
}

// Memoized component for product cards to prevent unnecessary re-renders
const ProductCard = memo(({ product }: { product: Business['business_products'][0] }) => {
  return (
    <Card key={product.id} className="p-4 space-y-2 transition-all duration-300 hover:shadow-md">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{product.name}</h3>
          {product.category && (
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        <div className="flex justify-between items-center">
          <div className="font-semibold">₹{product.price}</div>
          <StockBadge stock={product.stock || 0} />
        </div>
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

export const BusinessProductsSection = ({ 
  products: initialProducts, 
  businessId,
  activeCategory 
}: BusinessProductsSectionProps) => {
  // Use our enhanced hook with caching and real-time updates
  const { data: products, isLoading } = useBusinessProducts(businessId);
  
  // Fallback to initial products if hook data isn't available yet
  const allProducts = products || initialProducts;
  
  // Filter products by category if activeCategory is specified
  const displayProducts = activeCategory 
    ? allProducts?.filter(product => product.category === activeCategory)
    : allProducts;
  
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
  
  if (!displayProducts?.length) {
    if (activeCategory) {
      return (
        <div className="text-center py-12 animate-fade-in">
          <Tag className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">No products in {activeCategory} category</h3>
          <p className="text-muted-foreground mt-1">There are no products in this category yet.</p>
        </div>
      );
    }
    return null;
  }

  // Rendering optimization using memo and virtualization concepts
  return (
    <div className="space-y-4 animate-fade-in">
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
          // Actual product cards - ensure we're passing the correct type by casting if needed
          displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};
