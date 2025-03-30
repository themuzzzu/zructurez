
import { useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { Loader2, Search, ShoppingBag, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/components/products/types/ProductTypes";
import { Card } from "@/components/ui/card";

export const ProductWishlist = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { wishlistItems, isLoading: wishlistLoading } = useWishlist();
  
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['wishlist-products', wishlistItems],
    queryFn: async () => {
      if (!wishlistItems.length) return [];
      
      const productIds = wishlistItems.map(item => item.product_id);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);
        
      if (error) {
        console.error('Error fetching wishlist products:', error);
        return [];
      }
      
      return data as ProductType[];
    },
    enabled: wishlistItems.length > 0,
  });
  
  const isLoading = wishlistLoading || productsLoading;
  
  const filteredProducts = products.filter(product => {
    const productName = product.name || product.title || '';
    const productDesc = product.description || '';
    const query = searchQuery.toLowerCase();
    
    return productName.toLowerCase().includes(query) || 
           productDesc.toLowerCase().includes(query);
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (wishlistItems.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Your wishlist is empty</h3>
          <p className="text-muted-foreground">
            Save items you like by clicking the heart icon on products.
          </p>
          <Button onClick={() => window.location.href = '/marketplace'}>
            Explore Products
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search wishlist..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={() => setSearchQuery("")}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No matching products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              showWishlistButton
            />
          ))}
        </div>
      )}
    </div>
  );
};
