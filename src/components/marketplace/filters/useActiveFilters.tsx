
import { useState, useEffect } from "react";

export const useActiveFilters = (
  showDiscounted: boolean,
  showUsed: boolean,
  showBranded: boolean,
  priceRange: string,
  selectedCategory: string
) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  useEffect(() => {
    const filters = [];
    if (showDiscounted) filters.push('discounted');
    if (showUsed) filters.push('used');
    if (showBranded) filters.push('branded');
    if (priceRange !== 'all') filters.push('price');
    if (selectedCategory !== 'all') filters.push('category');
    setActiveFilters(filters);
  }, [showDiscounted, showUsed, showBranded, priceRange, selectedCategory]);

  return activeFilters;
};
