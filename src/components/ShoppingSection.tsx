import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { CreateProductForm } from "./marketplace/CreateProductForm";
import { ProductCard } from "./products/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ShoppingSectionProps {
  searchQuery?: string;
  selectedCategory?: string | null;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
}

export const ShoppingSection = ({
  searchQuery = "",
  selectedCategory = null,
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = "newest"
}: ShoppingSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: products, refetch } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory, showDiscounted, showUsed, showBranded, sortOption],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*');

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (selectedCategory) {
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

      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found. Add your first product!</p>
        </div>
      )}
    </div>
  );
};