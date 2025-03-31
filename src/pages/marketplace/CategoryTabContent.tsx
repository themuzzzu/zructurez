
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterCategories } from "@/components/marketplace/filters/FilterCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";

interface CategoryTabContentProps {
  setSelectedCategory: (category: string) => void;
  setActiveTab: (tab: string) => void;
  gridLayout?: GridLayoutType;
  category?: string;
}

export const CategoryTabContent = ({ 
  setSelectedCategory, 
  setActiveTab,
  gridLayout = "grid4x4",
  category = "all"
}: CategoryTabContentProps) => {
  const [activeCategory, setActiveCategory] = useState(category);
  
  // Update the active category when the prop changes
  useEffect(() => {
    setActiveCategory(category);
  }, [category]);

  // Fetch products by category
  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', activeCategory],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*');
      
      if (activeCategory && activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false }).limit(12);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSelectedCategory(category);
  };

  // Generate responsive grid classes based on layout
  const getGridClasses = () => {
    switch (gridLayout) {
      case "grid4x4":
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4";
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4";
      case "grid1x1":
        return "flex flex-col gap-3";
      default:
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <FilterCategories 
          selectedCategory={activeCategory} 
          onCategorySelect={handleCategoryChange}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {activeCategory === 'all' ? 'All Categories' : 
           activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).replace(/-/g, ' ')}
        </h2>
        
        {isLoading ? (
          <div className={getGridClasses()}>
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
          <div className={getGridClasses()}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} layout={gridLayout} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No products found in this category.</p>
            <Button 
              variant="outline" 
              onClick={() => handleCategoryChange('all')}
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
      
      <SponsoredProducts gridLayout={gridLayout} />
    </div>
  );
};
