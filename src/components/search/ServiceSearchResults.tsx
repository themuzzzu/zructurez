
import React from 'react';
import { SearchResult } from "@/types/search";
import { ServiceCard } from "@/components/ServiceCard";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";

interface ServiceSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
}

export function ServiceSearchResults({ results, isLoading, query }: ServiceSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!results.length) {
    return <EmptySearchResults searchTerm={query} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result) => (
        <ServiceCard
          key={result.id}
          id={result.id}
          name={result.title}
          description={result.description}
          price={`$${result.price?.toFixed(2) || '0.00'}`}
          image={result.imageUrl || ''}
          providerName="Service Provider" // Default provider name
          providerId="provider-id" // Default provider ID
          contact_info="" // Default contact info
        />
      ))}
    </div>
  );
}
