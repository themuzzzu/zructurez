
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchResult } from "@/types/search";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { LikeProvider } from "@/components/products/LikeContext";
import { EnhancedProductSearchResults } from "./EnhancedProductSearchResults";
import { Button } from "@/components/ui/button";
import { Grid, Grid2X2, LayoutList } from "lucide-react";

interface ProductSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  categoryFilter?: string;
}

export function ProductSearchResults({
  results,
  isLoading,
  query,
  categoryFilter
}: ProductSearchResultsProps) {
  const navigate = useNavigate();
  
  // Get grid layout preference from localStorage or default to 4x4
  const [gridLayout, setGridLayout] = useState<GridLayoutType>(() => {
    const savedLayout = localStorage.getItem("searchGridLayout");
    return (savedLayout === "grid1x1" || savedLayout === "grid2x2" || savedLayout === "grid4x4") 
      ? (savedLayout as GridLayoutType)
      : "grid4x4";
  });
  
  // Handle grid layout change
  const handleLayoutChange = (layout: GridLayoutType) => {
    setGridLayout(layout);
    localStorage.setItem("searchGridLayout", layout);
  };
  
  // Filter results by category if provided
  const filteredResults = categoryFilter 
    ? results.filter(item => item.category?.toLowerCase() === categoryFilter.toLowerCase())
    : results;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium">
            {isLoading ? "Searching..." : `${filteredResults.length} Results ${query ? `for "${query}"` : ""}`}
          </h2>
        </div>
        
        <div className="flex items-center border rounded-md overflow-hidden">
          <Button 
            variant={gridLayout === "grid4x4" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => handleLayoutChange("grid4x4")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant={gridLayout === "grid2x2" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => handleLayoutChange("grid2x2")}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button 
            variant={gridLayout === "grid1x1" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => handleLayoutChange("grid1x1")}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <LikeProvider>
        <EnhancedProductSearchResults
          results={filteredResults}
          isLoading={isLoading}
          query={query}
          gridLayout={gridLayout}
        />
      </LikeProvider>
    </div>
  );
}
