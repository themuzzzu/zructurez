
import React from 'react';
import { SearchResult } from "@/types/search";
import { BusinessCard } from "@/components/BusinessCard";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";

interface BusinessSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
}

export function BusinessSearchResults({ results, isLoading, query }: BusinessSearchResultsProps) {
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
        <BusinessCard
          key={result.id}
          id={result.id}
          name={result.title}
          description={result.description}
          category={result.category || ''}
          image_url={result.imageUrl}
          rating={4.5} // Default rating
          reviews={10} // Default reviews count
          location="Local Area" // Default location
          contact="" // Default contact
          hours="" // Default hours
        />
      ))}
    </div>
  );
}
