
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchFilters } from "@/components/search/SearchFilters";
import { useSearch } from "@/hooks/useSearch";
import { SearchFilters as SearchFiltersType } from "@/types/search";
import { ArrowLeft, Sliders, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Initialize with URL params
  const initialQuery = searchParams.get("q") || "";
  const initialFilters: SearchFiltersType = {
    includeSponsored: searchParams.get("sponsored") !== "false",
    sortBy: (searchParams.get("sort") as any) || "relevance",
    categories: searchParams.getAll("category"),
    priceMin: searchParams.has("min") ? Number(searchParams.get("min")) : undefined,
    priceMax: searchParams.has("max") ? Number(searchParams.get("max")) : undefined,
  };
  
  const { 
    query, 
    setQuery, 
    filters, 
    updateFilters,
    results,
    isLoading,
    correctedQuery,
    search,
    handleResultClick,
  } = useSearch({
    initialQuery,
    initialFilters,
    suggestionsEnabled: true,
  });
  
  // Update URL when search params change
  useEffect(() => {
    if (query) {
      searchParams.set("q", query);
    } else {
      searchParams.delete("q");
    }
    
    // Update filter params
    if (filters.sortBy && filters.sortBy !== "relevance") {
      searchParams.set("sort", filters.sortBy);
    } else {
      searchParams.delete("sort");
    }
    
    searchParams.delete("category");
    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach(category => {
        searchParams.append("category", category);
      });
    }
    
    if (filters.priceMin !== undefined) {
      searchParams.set("min", filters.priceMin.toString());
    } else {
      searchParams.delete("min");
    }
    
    if (filters.priceMax !== undefined) {
      searchParams.set("max", filters.priceMax.toString());
    } else {
      searchParams.delete("max");
    }
    
    if (filters.includeSponsored === false) {
      searchParams.set("sponsored", "false");
    } else {
      searchParams.delete("sponsored");
    }
    
    setSearchParams(searchParams);
  }, [query, filters, setSearchParams]);
  
  // Perform search on mount or when URL params change
  useEffect(() => {
    if (initialQuery) {
      search(initialQuery, initialFilters);
    }
  }, []);
  
  // Reset filters
  const resetFilters = () => {
    updateFilters({
      categories: [],
      priceMin: undefined,
      priceMax: undefined,
      sortBy: "relevance",
      includeSponsored: true,
    });
  };
  
  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    search(searchQuery, filters);
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 pb-16">
        {/* Search header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 border-b shadow-sm">
          <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="mr-1" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search products, businesses, services..."
                autoFocus={!query}
              />
            </div>
            
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Sliders className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <SearchFilters
                    filters={filters}
                    onChange={updateFilters}
                    onReset={resetFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
            
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Sliders className="h-4 w-4" />
              {showFilters ? "Hide filters" : "Show filters"}
            </Button>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          {/* Search metadata */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SearchIcon className="h-3.5 w-3.5" />
              {isLoading ? (
                <span>Searching...</span>
              ) : (
                <span>
                  {results.length} results {query ? `for "${query}"` : ""}
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters sidebar - desktop */}
            <div className={`hidden lg:block ${showFilters ? 'block' : 'hidden'}`}>
              <div className="sticky top-24">
                <SearchFilters
                  filters={filters}
                  onChange={updateFilters}
                  onReset={resetFilters}
                />
              </div>
            </div>
            
            {/* Search results */}
            <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              <SearchResults
                results={results}
                onResultClick={handleResultClick}
                isLoading={isLoading}
                correctedQuery={correctedQuery}
                originalQuery={query}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
