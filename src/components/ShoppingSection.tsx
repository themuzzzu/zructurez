
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { CreateProductForm } from "./marketplace/CreateProductForm";
import { ProductCard } from "./products/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";

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
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [localSortOption, setLocalSortOption] = useState(sortOption);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory, showDiscounted, showUsed, showBranded, localSortOption, priceRange],
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
      switch (localSortOption) {
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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center bg-white dark:bg-zinc-800 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold hidden sm:block">
            {selectedCategory && selectedCategory !== 'all' 
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products` 
              : 'All Products'}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden flex items-center gap-1"
            onClick={() => setIsFilterMobileOpen(!isFilterMobileOpen)}
          >
            <Filter size={16} />
            Filters
            {(showDiscounted || showUsed || showBranded || priceRange !== 'all') && (
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
            <Select value={localSortOption} onValueChange={(value) => setLocalSortOption(value)}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="most-viewed">Most Viewed</SelectItem>
                <SelectItem value="best-selling">Best Selling</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Mobile filter panel */}
      {isFilterMobileOpen && (
        <div className="block sm:hidden bg-white dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Filters</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsFilterMobileOpen(false)}>
              <X size={16} />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Sort by</label>
              <Select value={localSortOption} onValueChange={(value) => setLocalSortOption(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="most-viewed">Most Viewed</SelectItem>
                  <SelectItem value="best-selling">Best Selling</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

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

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-zinc-800">
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
