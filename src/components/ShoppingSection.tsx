import React, { useState } from 'react';
import { ProductsGrid } from './products/ProductsGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridLayoutType } from './products/types/layouts';

interface ShoppingSectionProps {
  searchQuery: string;
  selectedCategory?: string;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
  priceRange?: string;
  gridLayout?: GridLayoutType;
}

export const ShoppingSection = ({
  searchQuery,
  selectedCategory = '',
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = 'newest',
  priceRange = 'all',
  gridLayout = 'grid4x4'
}: ShoppingSectionProps) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory, showDiscounted, showUsed, showBranded, sortOption, priceRange],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*');
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
      }
      
      if (selectedCategory && selectedCategory !== 'all') {
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
      
      if (sortOption === 'priceAsc') {
        query = query.order('price', { ascending: true });
      } else if (sortOption === 'priceDesc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      if (priceRange !== 'all') {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
        query = query.gte('price', minPrice).lte('price', maxPrice);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      
      return data;
    },
  });
  
  return (
    <div>
      {/* Filters can go here */}
      <ProductsGrid 
        products={products || []} 
        isLoading={isLoading} 
        layout={gridLayout}
        searchQuery={searchQuery}
      />
    </div>
  );
};
