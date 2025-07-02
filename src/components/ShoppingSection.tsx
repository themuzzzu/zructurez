import React, { FC, useState, useEffect } from "react";
import { ProductsGrid } from "./ProductsGrid";
import { ErrorView } from "./ErrorView";
import { LoadingView } from "./LoadingView";
import { GridLayoutType } from "./products/types/ProductTypes";

interface ShoppingSectionProps {
  searchQuery?: string;
  selectedCategory?: string;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
  priceRange?: string;
  gridLayout?: string;
  title?: string;
  isLoading?: boolean;
  results?: any[];
  hasError?: boolean;
  onRetry?: () => void;
}

export const ShoppingSection: FC<ShoppingSectionProps> = ({
  searchQuery = "",
  selectedCategory = "",
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = "newest",
  priceRange = "all",
  gridLayout = "grid2x2",
  title = "Shopping",
  isLoading: externalIsLoading = false,
  results = [],
  hasError = false,
  onRetry = () => {}
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayProducts, setDisplayProducts] = useState(results);

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      // Apply filters and sorting to the results
      let filteredProducts = [...results];

      if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
      }

      if (showDiscounted) {
        filteredProducts = filteredProducts.filter(product => product.is_discounted);
      }

      if (showUsed) {
        filteredProducts = filteredProducts.filter(product => product.is_used);
      }

      if (showBranded) {
        filteredProducts = filteredProducts.filter(product => product.is_branded);
      }

      if (sortOption === "priceAsc") {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sortOption === "priceDesc") {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sortOption === "rating") {
        filteredProducts.sort((a, b) => b.rating - a.rating);
      } else {
        filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      if (priceRange !== "all") {
        const [minPrice, maxPrice] = priceRange.split("-").map(Number);
        filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
      }

      setDisplayProducts(filteredProducts);
      setIsLoading(false);
    }, 500);
  }, [searchQuery, selectedCategory, showDiscounted, showUsed, showBranded, sortOption, priceRange, results]);

  if (hasError) {
    return <ErrorView onRetry={onRetry} />;
  }

  if (externalIsLoading || isLoading) {
    return <LoadingView />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      <ProductsGrid 
        products={displayProducts} 
        gridLayout={gridLayout as GridLayoutType}
        isLoading={isLoading}
      />
    </div>
  );
};
