
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingHeader } from "./shopping/ShoppingHeader";
import { FilterPanel } from "./shopping/FilterPanel";
import { ProductsGrid } from "./shopping/ProductsGrid";
import { AddProductDialog } from "./shopping/AddProductDialog";
import { BannerCarousel } from "./marketplace/BannerCarousel";

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
  const [localShowDiscounted, setLocalShowDiscounted] = useState(showDiscounted);
  const [localShowUsed, setLocalShowUsed] = useState(showUsed);
  const [localShowBranded, setLocalShowBranded] = useState(showBranded);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory, localShowDiscounted, localShowUsed, localShowBranded, localSortOption, localPriceRange],
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

      if (localShowDiscounted) {
        query = query.eq('is_discounted', true);
      }

      if (localShowUsed) {
        query = query.eq('is_used', true);
      }

      if (localShowBranded) {
        query = query.eq('is_branded', true);
      }

      if (localPriceRange !== 'all') {
        const [min, max] = localPriceRange.split('-').map(Number);
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

  const hasActiveFilters = localShowDiscounted || localShowUsed || localShowBranded || localPriceRange !== 'all';

  return (
    <div className="space-y-4">
      {/* Banner Carousel for Advertisements */}
      <BannerCarousel />

      <ShoppingHeader 
        selectedCategory={selectedCategory}
        onOpenAddProductDialog={() => setIsDialogOpen(true)}
        onToggleMobileFilters={() => setIsFilterMobileOpen(!isFilterMobileOpen)}
        sortOption={localSortOption}
        onSortChange={(value) => setLocalSortOption(value)}
        hasActiveFilters={hasActiveFilters}
      />

      <FilterPanel 
        selectedCategory={selectedCategory}
        showDiscounted={localShowDiscounted}
        showUsed={localShowUsed}
        showBranded={localShowBranded}
        sortOption={localSortOption}
        priceRange={localPriceRange}
        onDiscountedChange={setLocalShowDiscounted}
        onUsedChange={setLocalShowUsed}
        onBrandedChange={setLocalShowBranded}
        onSortChange={setLocalSortOption}
        onPriceRangeChange={setLocalPriceRange}
        onCloseMobileFilter={() => setIsFilterMobileOpen(false)}
        isFilterMobileOpen={isFilterMobileOpen}
      />

      <ProductsGrid 
        products={products}
        isLoading={isLoading} 
        onOpenAddProductDialog={() => setIsDialogOpen(true)}
      />

      <AddProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          setIsDialogOpen(false);
          refetch();
        }}
      />
    </div>
  );
};
