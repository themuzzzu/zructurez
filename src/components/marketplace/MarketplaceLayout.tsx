
import React from 'react';
import { MarketplaceCategoryScroller } from './MarketplaceCategoryScroller';
import { AutocompleteSearch } from './AutocompleteSearch';
import { ProductRankings } from './ProductRankings';
import { useMarketplace } from '@/providers/MarketplaceProvider';

export const MarketplaceLayout = () => {
  const { 
    searchQuery, 
    setSearchQuery
  } = useMarketplace();

  return (
    <div className="min-h-screen bg-black">
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
        <ProductRankings />
      </div>
    </div>
  );
};
