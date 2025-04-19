
import React, { useState } from 'react';
import { MarketplaceSections } from './MarketplaceSections';
import { AutocompleteSearch } from './AutocompleteSearch';
import { useMarketplace } from '@/providers/MarketplaceProvider';

export const MarketplaceLayout = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    gridLayout
  } = useMarketplace();
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const handleCategoryChange = (category: string, subcategory?: string) => {
    setSelectedCategory(category);
    if (subcategory) {
      setSelectedSubcategory(subcategory);
    } else {
      setSelectedSubcategory('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="max-w-2xl mx-auto mb-8">
        <AutocompleteSearch 
          placeholder="Search for products..."
          className="w-full"
          value={searchQuery}
          onChange={setSearchQuery}
          onSearchSelect={setSearchQuery}
        />
      </div>
      <MarketplaceSections 
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onCategoryChange={handleCategoryChange}
        gridLayout={gridLayout}
      />
    </div>
  );
};
