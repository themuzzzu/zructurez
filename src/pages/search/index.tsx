import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { EnhancedShoppingSection } from "@/components/EnhancedShoppingSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, Heart } from "lucide-react";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { LikeProvider } from "@/components/products/LikeContext";
import { SearchInput } from "@/components/SearchInput";
import { debounce } from "@/utils/performanceUtils";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(query);
  const [showFilters, setShowFilters] = useState(false);
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid4x4");

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  // Debounce navigation to prevent excessive renders
  const debouncedNavigate = useCallback(
    debounce((term: string) => {
      if (term.trim()) {
        navigate(`/search?q=${encodeURIComponent(term)}`);
      }
    }, 300),
    [navigate]
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim().length > 2) {
      debouncedNavigate(value);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-2 sm:px-4 pt-20 pb-16 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 mt-4 gap-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">
              {searchTerm ? `Results for "${searchTerm}"` : "Search Results"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <GridLayoutSelector 
              layout={gridLayout} 
              onChange={(layout) => setGridLayout(layout)} 
            />
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/wishlist')}
              aria-label="View wishlist"
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-2 ml-auto sm:ml-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        
        {/* Search bar - minimalistic design */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative max-w-xl">
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full"
              onSubmit={handleSearch}
            />
          </form>
        </div>
        
        {/* Enhanced shopping section with tabbed interface for products, businesses and services */}
        <LikeProvider>
          <EnhancedShoppingSection 
            searchQuery={searchTerm} 
            showFilters={showFilters}
            gridLayout={gridLayout}
          />
        </LikeProvider>
      </main>
    </div>
  );
}
