
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { EnhancedShoppingSection } from "@/components/EnhancedShoppingSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { LikeProvider } from "@/components/products/LikeContext";

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
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
        
        {/* Search bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative max-w-xl">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
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
