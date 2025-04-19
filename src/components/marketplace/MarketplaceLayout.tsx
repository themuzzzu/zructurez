
import React from 'react';
import { MarketplaceCategoryScroller } from './MarketplaceCategoryScroller';
import { AutocompleteSearch } from './AutocompleteSearch';
import { useMarketplace } from '@/providers/MarketplaceProvider';

export const MarketplaceLayout = () => {
  const { 
    searchQuery, 
    setSearchQuery
  } = useMarketplace();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="max-w-2xl mx-auto mb-4">
        <AutocompleteSearch 
          placeholder="Search for products..."
          className="w-full"
          value={searchQuery}
          onChange={setSearchQuery}
          onSearchSelect={setSearchQuery}
        />
      </div>
      <MarketplaceCategoryScroller />
    </div>
  );
};
