
import React, { useState, useEffect } from 'react';
import { ShoppingSection } from './ShoppingSection';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessCard } from './BusinessCard';
import { Business } from '@/types/business';
import { GridLayoutType } from './products/types/layouts';
import { useNavigate } from 'react-router-dom';

interface EnhancedShoppingSectionProps {
  searchQuery: string;
  showFilters?: boolean;
  selectedCategory?: string;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
  priceRange?: string;
  gridLayout?: GridLayoutType;
}

export const EnhancedShoppingSection = ({
  searchQuery,
  showFilters = false,
  selectedCategory = '',
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = 'newest',
  priceRange = 'all',
  gridLayout = 'grid4x4'
}: EnhancedShoppingSectionProps) => {
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();
  
  // Query for businesses that match the search query
  const { data: businesses, isLoading: businessesLoading } = useQuery({
    queryKey: ['businesses', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(10);
      
      if (error) {
        console.error('Error fetching businesses:', error);
        return [];
      }
      
      return data as unknown as Business[];
    },
    enabled: !!searchQuery
  });

  // Handle tab change - for services redirect to search results
  const handleTabChange = (value: string) => {
    if (value === "services") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=services`);
      return;
    }
    setActiveTab(value);
  };

  return (
    <div>
      <Tabs defaultValue="products" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <ShoppingSection
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            showDiscounted={showDiscounted}
            showUsed={showUsed}
            showBranded={showBranded}
            sortOption={sortOption}
            priceRange={priceRange}
            gridLayout={gridLayout}
          />
        </TabsContent>
        
        <TabsContent value="businesses">
          {businessesLoading ? (
            <div className="flex justify-center p-8">Loading businesses...</div>
          ) : businesses && businesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No businesses found matching "{searchQuery}"</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="services">
          <div className="text-center p-8">
            <p className="text-muted-foreground">Service search results will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
