
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { Spinner } from '@/components/common/Spinner';
import type { GridLayoutType } from '@/components/products/types/ProductTypes';

interface ProductsTabContentProps {
  category?: string;
  layout?: GridLayoutType;
}

export const ProductsTabContent = ({ category = 'all', layout = "grid4x4" }: ProductsTabContentProps) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['tab-products', category],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      if (category && category !== 'all') {
        query = query.eq('category', category.toLowerCase());
      }
      
      const { data, error } = await query.limit(12);
      
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <ProductsGrid 
      products={products || []} 
      layout={layout}
      isLoading={isLoading}
    />
  );
};
