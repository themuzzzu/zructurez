
import React, { useState } from 'react';
import { ShoppingSection } from './ShoppingSection';
import { GridLayoutType } from './products/types/ProductTypes';
import { motion } from 'framer-motion';

interface EnhancedShoppingSectionProps {
  searchQuery: string;
  showFilters?: boolean;
  selectedCategory?: string;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
  priceRange?: string;
  gridLayout?: GridLayoutType;
}

export const EnhancedShoppingSection = ({
  searchQuery,
  showFilters = false,
  selectedCategory = '',
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = 'newest',
  priceRange = 'all',
  gridLayout = 'grid4x4'
}: EnhancedShoppingSectionProps) => {
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerAnimation}
      className="space-y-8"
    >
      <ShoppingSection
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        showDiscounted={showDiscounted}
        showUsed={showUsed}
        showBranded={showBranded}
        sortOption={sortOption}
        priceRange={priceRange}
        gridLayout={gridLayout}
        title="Search Results"
      />
    </motion.div>
  );
};
