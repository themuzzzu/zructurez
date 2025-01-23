import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingBag, Plus } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "./products/ProductCard";
import { Dialog, DialogContent } from "./ui/dialog";
import { useState } from "react";
import { CreateProductForm } from "./marketplace/CreateProductForm";
import { ScrollArea } from "./ui/scroll-area";

interface ShoppingSectionProps {
  searchQuery: string;
  selectedCategory: string | null;
  showDiscounted: boolean;
  showUsed: boolean;
  showBranded: boolean;
  sortOption: string;
}

export const ShoppingSection = ({ 
  searchQuery, 
  selectedCategory,
  showDiscounted,
  showUsed,
  showBranded,
  sortOption
}: ShoppingSectionProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: products, isLoading, isError } = useQuery({
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

      // Apply sorting
      switch (sortOption) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  const { data: userBusiness } = useQuery({
    queryKey: ['userBusiness'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching business:', error);
        return null;
      }

      return data;
    }
  });

  const handleCreateProduct = () => {
    if (!userBusiness) {
      toast.error("You need to register a business first to list products");
      return;
    }
    setIsCreateDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center">Loading products...</div>;
  }

  if (isError) {
    toast.error("Failed to load products");
    return <div className="text-center text-red-500">Error loading products</div>;
  }

  if (!products?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No products found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            View All
          </Button>
          <Button onClick={handleCreateProduct} className="gap-2">
            <Plus className="h-4 w-4" />
            List Product
          </Button>
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <ScrollArea className="h-full pr-4">
            <CreateProductForm 
              businessId={userBusiness?.id} 
              onSuccess={() => setIsCreateDialogOpen(false)} 
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
