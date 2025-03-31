
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/navbar/MobileNav';
import { Categories } from '@/components/marketplace/Categories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SponsoredProducts } from '@/components/marketplace/SponsoredProducts';
import { TrendingProducts } from '@/components/marketplace/TrendingProducts';
import { MarketplaceHeader } from './MarketplaceHeader';
import { BrowseTabContent } from './BrowseTabContent';
import { CategoryTabContent } from './CategoryTabContent';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

// Add framer-motion dependency
<lov-add-dependency>framer-motion@latest</lov-add-dependency>

export default function MarketplaceIndex() {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);
  const [trendingCategories, setTrendingCategories] = useState([]);

  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        const { data, error } = await supabase
          .from('search_suggestions')
          .select('*')
          .order('frequency', { ascending: false })
          .limit(6);
        
        if (error) throw error;
        setPopularSearches(data || []);
      } catch (err) {
        console.error('Error fetching popular searches:', err);
      }
    };

    const fetchTrendingCategories = async () => {
      try {
        // Fetch categories with most products
        const { data, error } = await supabase
          .from('products')
          .select('category')
          .not('category', 'is', null)
          .limit(5);
        
        if (error) throw error;
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data?.map(item => item.category))];
        setTrendingCategories(uniqueCategories || []);
      } catch (err) {
        console.error('Error fetching trending categories:', err);
        // Fallback to preset categories
        setTrendingCategories(['clothing', 'electronics', 'home', 'beauty', 'sports']);
      }
    };

    fetchPopularSearches();
    fetchTrendingCategories();
  }, []);

  const handleSearch = async (term) => {
    if (!term.trim()) return;

    setIsSearching(true);
    setSearchTerm(term);
    
    try {
      // Log search query for analytics
      await supabase.from('search_queries').insert({
        query: term,
        model_used: 'marketplace-search',
        results_count: 0, // Will be updated after results are fetched
      });

      // Fetch search results
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%`)
        .limit(20);
      
      if (error) throw error;
      
      // Update results count in analytics
      await supabase.from('search_queries')
        .update({ results_count: data.length })
        .eq('query', term);
      
      setSearchResults(data || []);
    } catch (err) {
      console.error('Error performing search:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActiveTab('category');
  };

  const handleSearchSelect = (term) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
        <MarketplaceHeader 
          onSearch={handleSearch} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isSearching={isSearching}
          popularSearches={popularSearches}
        />
        
        <div className="mt-2 mb-6 overflow-x-auto scrollbar-hide">
          <Categories 
            onCategorySelect={handleCategorySelect}
            trendingCategories={trendingCategories}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="category">Categories</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="browse">
              <BrowseTabContent 
                searchResults={searchResults} 
                searchTerm={searchTerm} 
                isSearching={isSearching}
                onCategorySelect={handleCategorySelect}
                onSearchSelect={handleSearchSelect}
              />
            </TabsContent>

            <TabsContent value="category">
              <CategoryTabContent 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory}
                setActiveTab={setActiveTab}
              />
            </TabsContent>

            <TabsContent value="trending">
              <div className="space-y-8">
                <SponsoredProducts />
                <TrendingProducts />
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>
      
      <MobileNav />
    </div>
  );
}
