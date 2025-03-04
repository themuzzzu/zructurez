
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
        .select('*');

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      // Process selectedCategory properly
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

      switch (sortOption) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'most-viewed':
          query = query.order('views', { ascending: false });
          break;
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      return data || [];
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
