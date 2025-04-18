
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchLayout } from "@/components/search/SearchLayout";
import { ServiceSearchResults } from "@/components/search/ServiceSearchResults";
import { ServiceSearchFilters } from "@/components/search/ServiceSearchFilters";
import { useSearch } from "@/hooks/useSearch";
import { SearchFilters } from "@/types/search";

export default function ServicesSearch() {
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
    { label: "Services", href: "/services" },
    { label: query, href: `/search/services?q=${query}` }
  ];

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto">
        <SearchLayout
          filters={
            <ServiceSearchFilters
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
              <ServiceSearchResults
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
