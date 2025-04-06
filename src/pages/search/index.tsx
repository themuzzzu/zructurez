
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useSearchParams } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { Spinner } from "@/components/common/Spinner";
import { ServiceBannerAd } from "@/components/ads/ServiceBannerAd";
import { Container } from "@/components/ui/container";

export default function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";
  const sort = searchParams.get("sort") || "relevance";
  
  const [searchType, setSearchType] = useState(type);

  const {
    query,
    setQuery,
    results,
    isLoading,
    correctedQuery,
    search,
    updateFilters,
    filters,
  } = useSearch({
    initialQuery,
    initialFilters: { 
      type: searchType !== "all" ? searchType : undefined,
      sortBy: sort as any
    },
  });

  // Perform search when component mounts or when query/type changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      search(initialQuery, { 
        ...filters, 
        type: searchType !== "all" ? searchType : undefined,
        sortBy: sort as any
      });
    }
  }, [initialQuery, searchType, sort]);

  const handleTypeChange = (newType: string) => {
    setSearchType(newType);
    updateFilters({ type: newType !== "all" ? newType : undefined });
    search(query, { ...filters, type: newType !== "all" ? newType : undefined });
  };

  return (
    <Layout>
      <Container>
        <div className="py-6">
          <div className="mb-8">
            <SearchBar 
              placeholder={`Search ${searchType !== "all" ? searchType + "s" : "everything"}...`}
              onSearch={(q) => search(q)}
              showSuggestions
              autoFocus
              className="max-w-3xl mx-auto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
            <aside>
              <SearchFilters 
                filters={filters}
                onFilterChange={updateFilters}
                onTypeChange={handleTypeChange}
                selectedType={searchType}
              />
            </aside>
            
            <main>
              {/* Top banner ad - specifically for services */}
              {searchType === "service" && (
                <div className="mb-6">
                  <ServiceBannerAd />
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner />
                </div>
              ) : (
                <div className="space-y-4">
                  <SearchResults
                    results={results}
                    correctedQuery={correctedQuery}
                    originalQuery={query !== correctedQuery ? query : undefined}
                  />
                  
                  {/* Bottom banner ad - specifically for services */}
                  {searchType === "service" && results.length > 0 && (
                    <div className="mt-8">
                      <ServiceBannerAd />
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
