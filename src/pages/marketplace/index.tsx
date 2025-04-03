
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/navbar/MobileNav';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SponsoredProducts } from '@/components/marketplace/SponsoredProducts';
import { TrendingProducts } from '@/components/marketplace/TrendingProducts';
import { RecommendedProducts } from '@/components/marketplace/RecommendedProducts';
import { PersonalizedRecommendations } from '@/components/marketplace/PersonalizedRecommendations';
import { MarketplaceHeader } from './MarketplaceHeader';
import { BrowseTabContent } from './BrowseTabContent';
import { CategoryTabContent } from './CategoryTabContent';
import { BannerCarousel } from '@/components/marketplace/BannerCarousel';
import { CategoryIconGrid } from '@/components/marketplace/CategoryIconGrid';
import { Categories } from '@/components/marketplace/Categories';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

export default function MarketplaceIndex() {
  const navigate = useNavigate();
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
        const { data, error } = await supabase
          .from('products')
          .select('category')
          .not('category', 'is', null)
          .limit(5);
        
        if (error) throw error;
        
        const uniqueCategories = [...new Set(data?.map(item => item.category))];
        setTrendingCategories(uniqueCategories || []);
      } catch (err) {
        console.error('Error fetching trending categories:', err);
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
      await supabase.from('search_queries').insert({
        query: term,
        model_used: 'marketplace-search',
        results_count: 0,
      });

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%`)
        .limit(20);
      
      if (error) throw error;
      
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
    // Navigate to category page with this category pre-selected
    navigate(`/marketplace/category/${category}`);
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
        
        {/* Banner carousel below search */}
        <div className="mt-4 mb-6">
          <BannerCarousel />
        </div>

        {/* Horizontal scrolling categories */}
        <div className="mt-2 mb-6 overflow-x-auto scrollbar-hide">
          <Categories 
            onCategorySelect={handleCategorySelect}
            trendingCategories={trendingCategories}
          />
        </div>
        
        {/* Category Icon Grid for easy navigation */}
        <div className="mb-8">
          <CategoryIconGrid onCategorySelect={handleCategorySelect} />
        </div>

        {/* Sponsored Products Section */}
        <div className="mb-8">
          <SponsoredProducts />
        </div>
        
        {/* Recommended Products */}
        <div className="mb-8">
          <RecommendedProducts />
        </div>
        
        {/* Personalized Recommendations */}
        <div className="mb-8">
          <PersonalizedRecommendations />
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
