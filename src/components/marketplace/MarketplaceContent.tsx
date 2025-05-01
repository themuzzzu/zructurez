
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SponsoredProducts } from "./SponsoredProducts";
import { ProductCard } from "../ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export const MarketplaceContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  
  // Fetch all products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('stock', 0, { negate: true });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      
      return data;
    }
  });
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    searchQuery === "" || 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const categories = [
    "All", "Electronics", "Clothing", "Home", "Beauty", "Sports", "Books"
  ];
  
  const handleCategoryChange = (selectedCategory: string) => {
    setCategory(selectedCategory === "All" ? null : selectedCategory);
  };
  
  // Increment product view when clicked
  const handleProductClick = async (productId: string) => {
    try {
      await supabase.rpc('increment_product_views', { product_id_param: productId });
    } catch (error) {
      console.error('Error incrementing product view:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          className="pl-10 bg-white dark:bg-gray-800"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={cat === (category || "All") ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
      
      {/* Sponsored Products */}
      <SponsoredProducts />
      
      {/* Regular Products */}
      <div>
        <h2 className="text-xl font-bold mb-4">Products</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border">
                <Skeleton className="h-40 w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} onClick={() => handleProductClick(product.id)}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No products found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
