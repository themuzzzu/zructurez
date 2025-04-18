
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchLayout } from "@/components/search/SearchLayout";
import { ProductSearchResults } from "@/components/search/ProductSearchResults";
import { ImprovedSearchFilters } from "@/components/search/ImprovedSearchFilters";
import { useSearch } from "@/hooks/useSearch";
import { SearchFilters } from "@/types/search";

export default function MarketplaceSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { results, isLoading, search } = useSearch({
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
    { label: "Marketplace", href: "/marketplace" },
    { label: query, href: `/search/marketplace?q=${query}` }
  ];

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto">
        <SearchLayout
          filters={
            <ImprovedSearchFilters
              filters={{}}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          }
          content={
            <div className="space-y-4">
              <SearchHeader 
                query={query}
                totalResults={results.length}
                breadcrumbs={breadcrumbs}
              />
              <ProductSearchResults
                results={results}
                isLoading={isLoading}
                query={query}
              />
            </div>
          }
        />
      </div>
    </Layout>
  );
}
