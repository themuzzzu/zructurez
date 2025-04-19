
import React from 'react';
import { SearchResult } from "@/types/search";
import { BusinessSearchResult } from "@/types/businessTypes";
import { BusinessCard } from "@/components/BusinessCard";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";

interface BusinessSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
}

export function BusinessSearchResults({ results, isLoading, query }: BusinessSearchResultsProps) {
  // Filter only business type results
  const businessResults = results.filter((result): result is BusinessSearchResult => 
    result.type === 'business'
  );

  if (isLoading) {
    return (
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!businessResults.length) {
    return <EmptySearchResults searchTerm={query} type="business" />;
  }

  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {businessResults.map((business) => (
        <BusinessCard
          key={business.id}
          id={business.id}
          name={business.title}
          description={business.description}
          category={business.category || ''}
          image_url={business.imageUrl}
          rating={business.rating || 4.5}
          reviews={business.reviews || 0}
          location={business.location || 'Local Area'}
          contact={business.contact || ''}
          hours={business.hours || ''}
        />
      ))}
    </div>
  );
}

