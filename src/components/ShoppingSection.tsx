
import React, { useState } from 'react';
import { ProductsGrid } from './products/ProductsGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridLayoutType } from './products/types/layouts';
import { ProductFilters } from './marketplace/ProductFilters';

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
  // Local state for filters
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localShowDiscounted, setLocalShowDiscounted] = useState(showDiscounted);
  const [localShowUsed, setLocalShowUsed] = useState(showUsed);
  const [localShowBranded, setLocalShowBranded] = useState(showBranded);
  const [localSortOption, setLocalSortOption] = useState(sortOption);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [localGridLayout, setLocalGridLayout] = useState<GridLayoutType>(gridLayout);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Reset filters function
  const resetFilters = () => {
    setLocalCategory('');
    setLocalShowDiscounted(false);
    setLocalShowUsed(false);
    setLocalShowBranded(false);
    setLocalSortOption('newest');
    setLocalPriceRange('all');
  };
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchQuery, localCategory, localShowDiscounted, localShowUsed, localShowBranded, localSortOption, localPriceRange],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*');
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
      }
      
      if (localCategory && localCategory !== 'all') {
        query = query.eq('category', localCategory);
      }
      
      if (localShowDiscounted) {
        query = query.eq('is_discounted', true);
      }
      
      if (localShowUsed) {
        query = query.eq('is_used', true);
      }
      
      if (localShowBranded) {
        query = query.eq('is_branded', true);
      }
      
      if (localSortOption === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (localSortOption === 'price-high') {
        query = query.order('price', { ascending: false });
      } else if (localSortOption === 'most-viewed') {
        query = query.order('views', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      if (localPriceRange !== 'all') {
        const [minPrice, maxPrice] = localPriceRange.split('-').map(val => val === 'up' ? '10000000' : val);
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters - Desktop */}
      <div className="hidden md:block">
        <ProductFilters 
          selectedCategory={localCategory}
          onCategorySelect={setLocalCategory}
          showDiscounted={localShowDiscounted}
          onDiscountedChange={setLocalShowDiscounted}
          showUsed={localShowUsed}
          onUsedChange={setLocalShowUsed}
          showBranded={localShowBranded}
          onBrandedChange={setLocalShowBranded}
          sortOption={localSortOption}
          onSortChange={setLocalSortOption}
          priceRange={localPriceRange}
          onPriceRangeChange={setLocalPriceRange}
          onResetFilters={resetFilters}
        />
      </div>
      
      {/* Products Grid */}
      <div className="md:col-span-3">
        <ProductsGrid 
          products={products || []} 
          isLoading={isLoading} 
          layout={localGridLayout}
          onLayoutChange={setLocalGridLayout}
        />
      </div>
    </div>
  );
};
