
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/productUtils";
import { toast } from "sonner";
import type { BusinessProduct } from "@/types/business";

interface BusinessProductsSectionProps {
  products: BusinessProduct[];
  businessId: string;
  activeCategory?: string;
}

export const BusinessProductsSection = ({ products, businessId, activeCategory }: BusinessProductsSectionProps) => {
  const [filteredProducts, setFilteredProducts] = useState<BusinessProduct[]>(products);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Filter products when the active category changes
  useEffect(() => {
    if (!activeCategory) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(product => product.category === activeCategory)
      );
    }
  }, [products, activeCategory]);

  const handleAddToCart = (product: BusinessProduct) => {
    toast.success(`Added ${product.name} to cart`);
  };

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Products Available</h3>
          <p className="text-muted-foreground mb-4">
            {activeCategory 
              ? `This business hasn't added any products in the ${activeCategory} category.`
              : "This business hasn't added any products yet."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            {product.image_url ? (
              <div className="relative h-48 w-full">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-48 w-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <CardContent className="p-4">
              <div className="mb-1 flex justify-between items-start">
                <h3 className="font-medium text-lg">{product.name}</h3>
                {product.category && (
                  <Badge variant="outline" className="ml-2">
                    {product.category}
                  </Badge>
                )}
              </div>
              <div className="text-lg font-bold mb-2">{formatPrice(product.price)}</div>
              {product.description && (
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {product.description}
                </p>
              )}
              <div className="mt-4">
                <button 
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag className="h-4 w-4 inline mr-2" />
                  Add to Cart
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
