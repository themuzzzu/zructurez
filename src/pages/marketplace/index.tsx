
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BannerCarousel } from '@/components/marketplace/BannerCarousel';
import { BrowseTabContent } from '@/components/marketplace/BrowseTabContent';
import { CategoryTabContent } from '@/components/marketplace/CategoryTabContent';
import { Layout } from '@/components/layout/Layout';

export default function MarketplaceIndex() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    navigate(`/marketplace/category/${category}`);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
        
        {/* Banner carousel */}
        <div className="mb-8">
          <BannerCarousel />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="category">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <BrowseTabContent 
              onCategorySelect={handleCategorySelect}
              onSearchSelect={handleSearch}
            />
          </TabsContent>

          <TabsContent value="category">
            <CategoryTabContent 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
