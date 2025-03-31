
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProductsGrid } from '@/components/shopping/ProductsGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GridLayoutType } from '@/components/products/types/layouts';
import { Categories } from '@/components/marketplace/Categories';

interface CategoryTabContentProps {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export const CategoryTabContent: React.FC<CategoryTabContentProps> = ({ 
  selectedCategory, 
  setSelectedCategory,
  setActiveTab
}) => {
  const [layout, setLayout] = useState<GridLayoutType>('grid2x2');
  const [sortBy, setSortBy] = useState('newest');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products-by-category', selectedCategory, sortBy],
    queryFn: async () => {
      if (!selectedCategory) return [];
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('category', selectedCategory);
      
      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('views', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }
      
      const { data, error } = await query.limit(24);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCategory
  });

  const goBack = () => {
    setActiveTab('browse');
  };

  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Select a Category</h2>
        <Categories 
          onCategorySelect={setSelectedCategory} 
          selectedCategory={selectedCategory}
          trendingCategories={[]}
          showAllCategories
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={goBack} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold capitalize">{selectedCategory}</h2>
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-[200px] w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </Card>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <ProductsGrid 
          products={products} 
          layout={layout} 
          setLayout={setLayout} 
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products found in this category</p>
          <Button onClick={goBack}>Browse All Products</Button>
        </div>
      )}
    </div>
  );
};
