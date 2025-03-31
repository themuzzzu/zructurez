
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/navbar/MobileNav';
import { Categories } from '@/components/marketplace/Categories';
import { Tab, TabContent, TabList, TabTrigger } from '@/components/ui/tabs-alt';
import { SponsoredProducts } from '@/components/marketplace/SponsoredProducts';
import { TrendingProducts } from '@/components/marketplace/TrendingProducts';
import { MarketplaceHeader } from './MarketplaceHeader';
import { BrowseTabContent } from './BrowseTabContent';
import { CategoryTabContent } from './CategoryTabContent';
import { supabase } from '@/integrations/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';

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
          .select('category, count')
          .not('category', 'is', null)
          .group('category')
          .order('count', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        setTrendingCategories(data?.map(item => item.category) || []);
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
        .textSearch('title', term, {
          type: 'websearch',
          config: 'english'
        })
        .limit(20);
      
      if (error) throw error;
      
      // Update results count in analytics
      await supabase.from('search_queries')
        .update({ results_count: data.length })
        .eq('query', term)
        .is('user_id', null);
      
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
            selectedCategory={selectedCategory}
            trendingCategories={trendingCategories}
          />
        </div>

        <Tab value={activeTab} onValueChange={setActiveTab}>
          <TabList className="mb-4">
            <TabTrigger value="browse">Browse</TabTrigger>
            <TabTrigger value="category">Categories</TabTrigger>
            <TabTrigger value="trending">Trending</TabTrigger>
          </TabList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabContent value="browse">
                <BrowseTabContent 
                  searchResults={searchResults} 
                  searchTerm={searchTerm} 
                  isSearching={isSearching}
                  onCategorySelect={handleCategorySelect}
                  onSearchSelect={handleSearchSelect}
                />
              </TabContent>

              <TabContent value="category">
                <CategoryTabContent 
                  selectedCategory={selectedCategory} 
                  setSelectedCategory={setSelectedCategory}
                  setActiveTab={setActiveTab}
                />
              </TabContent>

              <TabContent value="trending">
                <div className="space-y-8">
                  <SponsoredProducts />
                  <TrendingProducts />
                </div>
              </TabContent>
            </motion.div>
          </AnimatePresence>
        </Tab>
      </main>
      
      <MobileNav />
    </div>
  );
}
