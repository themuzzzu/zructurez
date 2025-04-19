
import React, { createContext, useContext, useState } from 'react';
import type { GridLayoutType } from '@/components/products/types/ProductTypes';

interface MarketplaceContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  gridLayout: GridLayoutType;
  setGridLayout: (layout: GridLayoutType) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [gridLayout, setGridLayout] = useState<GridLayoutType>('grid4x4');

  return (
    <MarketplaceContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        gridLayout,
        setGridLayout,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
