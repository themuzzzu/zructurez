
import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/products/ProductsGrid"; // Updated import
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { Categories } from "@/components/marketplace/Categories";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";

export interface CategoryTabContentProps {
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
  showDiscounted?: boolean;
  setShowDiscounted?: (value: boolean) => void;
  showUsed?: boolean;
  setShowUsed?: (value: boolean) => void;
  showBranded?: boolean;
  setShowBranded?: (value: boolean) => void;
  sortOption?: string;
  setSortOption?: (option: string) => void;
  priceRange?: string;
  setPriceRange?: (range: string) => void;
  resetFilters?: () => void;
  gridLayout?: GridLayoutType;
  setActiveTab?: (tab: string) => void;
}

export const CategoryTabContent = ({
  selectedCategory = "all",
  setSelectedCategory,
  gridLayout = "grid4x4",
  setActiveTab
}: CategoryTabContentProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCategorySelect = (category: string) => {
    if (setSelectedCategory) {
      setSelectedCategory(category);
    }
  };

  useEffect(() => {
    // Instead of fetching real products, use mock data
    setLoading(true);
    setTimeout(() => {
      const mockProducts = Array(8).fill(null).map((_, i) => ({
        id: `mock-${i}`,
        title: `Product ${i+1}`,
        description: `This is a mock product description ${i+1}`,
        price: Math.floor(Math.random() * 100) + 10,
        image_url: `https://picsum.photos/seed/${i+1}/300/300`
      }));
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <Categories onCategorySelect={handleCategorySelect} />
      </div>
      
      {products.length === 0 && !loading ? (
        <EmptySearchResults searchTerm={selectedCategory !== "all" ? selectedCategory : ""} />
      ) : (
        <ProductGrid 
          products={products} 
          layout={gridLayout}
          isLoading={loading}
          onOpenAddProductDialog={() => {}}
        />
      )}
    </div>
  );
};
