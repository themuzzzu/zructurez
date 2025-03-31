
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag,
  Tag,
  Heart,
  Share2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/productUtils";
import { toast } from "sonner";
import type { BusinessProduct } from "@/types/business";

interface BusinessProductsSectionProps {
  products: BusinessProduct[];
  businessId: string;
}

export const BusinessProductsSection = ({ products, businessId }: BusinessProductsSectionProps) => {
  const [activeProducts, setActiveProducts] = useState<BusinessProduct[]>(products);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast.success("Removed from wishlist");
    } else {
      setWishlist([...wishlist, productId]);
      toast.success("Added to wishlist");
    }
  };

  const shareProduct = (product: BusinessProduct) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleAddToCart = (product: BusinessProduct) => {
    toast.success(`Added ${product.name} to cart`);
  };

  if (!activeProducts || activeProducts.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Products Available</h3>
          <p className="text-muted-foreground mb-4">This business hasn't added any products yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            {product.image_url ? (
              <div className="relative h-48 w-full">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                />
                <Button
                  variant="ghost" 
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 rounded-full h-8 w-8"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
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
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="default" 
                  size="sm"
                  className="w-full mr-2"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => shareProduct(product)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
