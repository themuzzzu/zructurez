import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from "@/components/products/ProductsGrid";
import { Spinner } from "@/components/common/Spinner";
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
  showDiscounted = false,
  setShowDiscounted,
  showUsed = false,
  setShowUsed,
  showBranded = false,
  setShowBranded,
  sortOption = "newest",
  setSortOption,
  priceRange = "all",
  setPriceRange,
  resetFilters,
  gridLayout = "grid4x4",
}: CategoryTabContentProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleCategorySelect = (category: string) => {
    if (setSelectedCategory) {
      setSelectedCategory(category);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase.from("products").select("*");

        // Apply category filter
        if (selectedCategory && selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }

        // Apply discounted filter
        if (showDiscounted) {
          query = query.eq("is_discounted", true);
        }

        // Apply used filter
        if (showUsed) {
          query = query.eq("is_used", true);
        }

        // Apply branded filter
        if (showBranded) {
          query = query.eq("is_branded", true);
        }

        // Apply sorting
        switch (sortOption) {
          case "priceAsc":
            query = query.order("price", { ascending: true });
            break;
          case "priceDesc":
            query = query.order("price", { ascending: false });
            break;
          case "newest":
            query = query.order("created_at", { ascending: false });
            break;
          default:
            query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;

        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, showDiscounted, showUsed, showBranded, sortOption, priceRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <Categories onCategorySelect={handleCategorySelect} />
      </div>
      
      {products.length === 0 ? (
        <EmptySearchResults searchTerm={selectedCategory !== "all" ? selectedCategory : ""} />
      ) : (
        <ProductGrid 
          products={products} 
          layout={gridLayout}
          isLoading={false}
          onOpenAddProductDialog={() => {}}
        />
      )}
    </div>
  );
};
