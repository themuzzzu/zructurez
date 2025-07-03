
import React from "react";
import { Search } from "lucide-react";

interface EmptySearchResultsProps {
  searchTerm: string;
  entityType?: string;
}

export const EmptySearchResults = ({ searchTerm, entityType }: EmptySearchResultsProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Search className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No {entityType || 'results'} found
      </h3>
      <p className="text-gray-600">
        We couldn't find any {entityType || 'results'} for "{searchTerm}". Try adjusting your search terms.
      </p>
    </div>
  );
};
