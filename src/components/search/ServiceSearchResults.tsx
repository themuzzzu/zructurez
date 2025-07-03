
import React from "react";
import { EmptySearchResults } from "./EmptySearchResults";
import { ServicesGrid } from "../service-marketplace/ServicesGrid";

interface ServiceSearchResultsProps {
  searchTerm: string;
  isLoading: boolean;
  results: any[];
}

export const ServiceSearchResults = ({ searchTerm, isLoading, results }: ServiceSearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Searching services...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Service Results</h2>
          <p className="text-muted-foreground">
            {searchTerm ? `Search results for "${searchTerm}"` : "Browse all services"}
          </p>
        </div>
        <EmptySearchResults searchTerm={searchTerm} type="services" />
      </div>
    );
  }

  // Transform results to match Service interface
  const transformedResults = results.map(result => ({
    id: result.id,
    user_id: result.user_id || "unknown",
    title: result.title,
    description: result.description,
    category: result.category,
    image_url: result.image_url,
    price: result.price,
    rating: result.rating,
    location: result.location,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Service Results</h2>
        <p className="text-muted-foreground">
          {searchTerm ? `${results.length} results for "${searchTerm}"` : `${results.length} services found`}
        </p>
      </div>
      
      <ServicesGrid 
        services={transformedResults}
        isLoading={false}
        gridLayout="grid3x3"
      />
    </div>
  );
};
