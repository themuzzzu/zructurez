
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchHeader } from "@/components/search/SearchHeader";
import { BusinessSearchResults } from "@/components/search/BusinessSearchResults";
import { BusinessSearchFilters } from "@/components/search/BusinessSearchFilters";
import { useSearch } from "@/hooks/useSearch";
import { SearchFilters } from "@/types/search";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function BusinessSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { results, isLoading, search, correctedQuery } = useSearch({
    initialQuery: query,
    suggestionsEnabled: false
  });

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    search(query, newFilters);
  };

  const handleResetFilters = () => {
    search(query);
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Business", href: "/business" },
    { label: query, href: `/search/business?q=${query}` }
  ];

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-2 md:px-4 py-4">
        <SearchHeader 
          query={query}
          totalResults={results.length}
          breadcrumbs={breadcrumbs}
        />
        
        {/* Mobile filters button - only shown on small screens */}
        <div className="flex md:hidden items-center justify-between mb-4 border-b pb-2">
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[350px]">
              <div className="py-4">
                <h3 className="font-semibold text-lg mb-4">Business Filters</h3>
                <BusinessSearchFilters
                  filters={{}}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          <div>
            <Button variant="outline" size="sm">
              Sort By: Relevance
            </Button>
          </div>
        </div>
        
        {/* Main content with sidebar */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Desktop filters sidebar */}
          <div className="hidden md:block w-[240px] flex-shrink-0">
            <div className="sticky top-4">
              <BusinessSearchFilters
                filters={{}}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {/* Corrected query notification */}
            {correctedQuery && correctedQuery !== query && (
              <div className="mb-4 text-sm">
                Showing results for <span className="font-medium">{correctedQuery}</span> instead of <span className="italic">{query}</span>
              </div>
            )}
            
            {/* Results count - desktop */}
            <div className="hidden md:block mb-4">
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Searching...' : `Showing ${results.length} results for "${query}"`}
              </p>
            </div>
            
            <BusinessSearchResults
              results={results}
              isLoading={isLoading}
              query={query}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
