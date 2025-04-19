
import React from 'react';
import { MarketplaceSections } from './MarketplaceSections';
import { AutocompleteSearch } from './AutocompleteSearch';

export const MarketplaceLayout = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="max-w-2xl mx-auto mb-8">
        <AutocompleteSearch 
          placeholder="Search for products..."
          className="w-full"
        />
      </div>
      <MarketplaceSections />
    </div>
  );
};
