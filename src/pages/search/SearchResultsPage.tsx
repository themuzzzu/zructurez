
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useSearch } from "@/hooks/useSearch";
import { SearchResults } from "@/components/search/SearchResults";
import { ProductSearchResults } from "@/components/search/ProductSearchResults";
import { BusinessSearchResults } from "@/components/search/BusinessSearchResults";
import { ServiceSearchResults } from "@/components/search/ServiceSearchResults";

interface SearchResultsPageProps {
  type?: 'marketplace' | 'business' | 'services';
}

export default function SearchResultsPage({ type = 'marketplace' }: SearchResultsPageProps) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { results, isLoading } = useSearch({
    initialQuery: query,
    suggestionsEnabled: false,
    initialFilters: { category: type }
  });

  const getTitle = () => {
    switch (type) {
      case 'marketplace':
        return 'Products Search';
      case 'business':
        return 'Business Search';
      case 'services':
        return 'Services Search';
      default:
        return 'Search Results';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{getTitle()}</h1>
        
        {type === 'marketplace' && (
          <ProductSearchResults results={results} isLoading={isLoading} query={query} />
        )}
        
        {type === 'business' && (
          <BusinessSearchResults results={results} isLoading={isLoading} query={query} />
        )}
        
        {type === 'services' && (
          <ServiceSearchResults results={results} isLoading={isLoading} query={query} />
        )}
      </div>
    </Layout>
  );
}
