import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { CreateProductForm } from "./marketplace/CreateProductForm";
import { ProductCard } from "./products/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface ShoppingSectionProps {
  searchQuery?: string;
  selectedCategory?: string | null;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
  priceRange?: string;
}

export const ShoppingSection = ({
  searchQuery = "",
  selectedCategory = null,
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = "newest",
  priceRange = "all"
}: ShoppingSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: products, refetch } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory, showDiscounted, showUsed, showBranded, sortOption, priceRange],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, product_purchases(id)');

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (selectedCategory && selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      if (showDiscounted) {
        query = query.eq('is_discounted', true);
      }

      if (showUsed) {
        query = query.eq('is_used', true);
      }

      if (showBranded) {
        query = query.eq('is_branded', true);
      }

      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('price', min).lte('price', max);
        } else {
          query = query.gte('price', min);
        }
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      // Calculate sales count and trending score
      const productsWithRanking = data?.map(product => {
        // Safely access product_purchases
        const salesCount = Array.isArray(product.product_purchases) 
          ? product.product_purchases.length 
          : 0;
        
        const viewsWeight = 0.3;
        const salesWeight = 0.7;
        
        // Calculate trending score based on views and sales
        const trendingScore = (product.views * viewsWeight) + (salesCount * salesWeight);
        
        return {
          ...product,
          sales_count: salesCount,
          trending_score: trendingScore
        };
      }) || [];
      
      // Sort based on selected option
      switch (sortOption) {
        case 'newest':
          return productsWithRanking.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case 'oldest':
          return productsWithRanking.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case 'price-low':
          return productsWithRanking.sort((a, b) => a.price - b.price);
        case 'price-high':
          return productsWithRanking.sort((a, b) => b.price - a.price);
        case 'most-viewed':
          return productsWithRanking.sort((a, b) => b.views - a.views);
        case 'best-selling':
          return productsWithRanking.sort((a, b) => b.sales_count - a.sales_count);
        case 'trending':
          return productsWithRanking.sort((a, b) => b.trending_score - a.trending_score);
        default:
          return productsWithRanking;
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {selectedCategory && selectedCategory !== 'all' 
            ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products` 
            : 'All Products'}
        </h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <DialogTitle>Add New Product</DialogTitle>
          <ScrollArea className="h-full pr-4">
            <CreateProductForm 
              onSuccess={() => {
                setIsDialogOpen(false);
                refetch();
              }}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-muted-foreground">No products found matching your filters.</p>
          <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      )}
    </div>
  );
};
