
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchLayout } from "@/components/search/SearchLayout";
import { BusinessSearchResults } from "@/components/search/BusinessSearchResults";
import { BusinessSearchFilters } from "@/components/search/BusinessSearchFilters";
import { useSearch } from "@/hooks/useSearch";
import { SearchFilters } from "@/types/search";

export default function BusinessSearch() {
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
    { label: "Business", href: "/business" },
    { label: query, href: `/search/business?q=${query}` }
  ];

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto">
        <SearchLayout
          filters={
            <BusinessSearchFilters
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
              <BusinessSearchResults
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
