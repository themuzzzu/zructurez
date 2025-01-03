import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "./products/ProductCard";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string | null;
  image_url: string | null;
  stock: number;
  is_discounted?: boolean;
  is_used?: boolean;
  is_branded?: boolean;
  created_at: string;
}

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
        <Button variant="outline" className="gap-2">
          <ShoppingBag className="h-4 w-4" />
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};