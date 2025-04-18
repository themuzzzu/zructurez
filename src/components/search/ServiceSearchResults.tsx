
import React from 'react';
import { SearchResult } from "@/types/search";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";
import { ServicesGrid } from "@/components/service-marketplace/ServicesGrid";

interface ServiceSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
}

export function ServiceSearchResults({ results, isLoading, query }: ServiceSearchResultsProps) {
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

  if (!results.length) {
    return <EmptySearchResults searchTerm={query} />;
  }

  // Convert search results to service format
  const services = results.map(result => ({
    id: result.id,
    title: result.title,
    description: result.description,
    category: result.category || 'General',
    image_url: result.imageUrl,
    price: result.price || 0,
    rating: result.rating || 0,
    provider: result.provider || 'Service Provider',
    location: result.location || 'Local Area',
    availabilityStatus: 'Available',
    tags: result.tags || []
  }));

  return (
    <ServicesGrid services={services} layout="grid3x3" />
  );
}
