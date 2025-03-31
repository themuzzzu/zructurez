
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { Spinner } from "@/components/common/Spinner";
import { GridLayoutType } from "@/components/products/types/layouts";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";

export interface BrowseTabContentProps {
  selectedCategory?: string;
  showDiscounted?: boolean;
  setShowDiscounted?: (show: boolean) => void;
  showUsed?: boolean;
  setShowUsed?: (show: boolean) => void;
  showBranded?: boolean;
  setShowBranded?: (show: boolean) => void;
  sortOption?: string;
  setSortOption?: (option: string) => void;
  priceRange?: string;
  setPriceRange?: (range: string) => void;
  resetFilters?: () => void;
  gridLayout?: GridLayoutType;
  handleCategorySelect?: (category: string) => void;
  handleSearchSelect?: (term: string) => void;
}

export const BrowseTabContent = ({
  selectedCategory = "all",
  showDiscounted = false,
  showBranded = false,
  showUsed = false,
  sortOption = "newest",
  priceRange = "all",
  gridLayout = "grid4x4",
}: BrowseTabContentProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (products.length === 0) {
    return <EmptySearchResults />;
  }

  return (
    <div className="space-y-6">
      <ProductsGrid 
        products={products} 
        layout={gridLayout}
      />
    </div>
  );
};
