import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SponsoredProducts from '@/components/marketplace/SponsoredProducts';
import { TrendingProducts } from '@/components/marketplace/TrendingProducts';
import { RecommendedProducts } from '@/components/marketplace/RecommendedProducts';
import { PersonalizedRecommendations } from '@/components/marketplace/PersonalizedRecommendations';
import { MarketplaceHeader } from './MarketplaceHeader';
import { BrowseTabContent } from '@/components/marketplace/BrowseTabContent';
import { CategoryTabContent } from '@/components/marketplace/CategoryTabContent';
import { BannerCarousel } from '@/components/marketplace/BannerCarousel';
import { ShopByCategory } from '@/components/marketplace/ShopByCategory';
import { motion } from 'framer-motion';

export default function MarketplaceIndex() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);
  const [trendingCategories, setTrendingCategories] = useState([]);

  React.useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        setPopularSearches([
          { term: "electronics" },
          { term: "clothing" },
          { term: "furniture" },
          { term: "books" },
          { term: "toys" },
          { term: "kitchen" }
        ]);
      } catch (err) {
        console.error('Error fetching popular searches:', err);
      }
    };

    const fetchTrendingCategories = async () => {
      try {
        setTrendingCategories(['clothing', 'electronics', 'home', 'beauty', 'sports']);
      } catch (err) {
        console.error('Error fetching trending categories:', err);
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
      setTimeout(() => {
        setSearchResults([]);
        setIsSearching(false);
      }, 500);
    } catch (err) {
      console.error('Error performing search:', err);
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    navigate(`/marketplace/category/${category}`);
  };

  const handleSearchSelect = (term) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  return (
    <div className="container mx-auto px-4 pt-4 pb-16 max-w-7xl">
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

      {/* Shop by Category Section */}
      <div className="mb-8">
        <ShopByCategory onCategorySelect={handleCategorySelect} />
      </div>

      {/* Sponsored Products moved below categories */}
      <div className="mb-8">
        <SponsoredProducts />
      </div>
      
      {/* Recommended Products */}
      <div className="mb-8">
        <RecommendedProducts />
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
              <TrendingProducts />
              <SponsoredProducts />
            </div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}
