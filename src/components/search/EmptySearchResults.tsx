
import React from "react";
import { Search } from "lucide-react";

interface EmptySearchResultsProps {
  searchTerm: string;
  type?: string;
}

export const EmptySearchResults = ({ searchTerm, type = "results" }: EmptySearchResultsProps) => {
  return (
    <div className="text-center py-12">
      <div className="flex flex-col items-center gap-4">
        <Search className="h-16 w-16 text-gray-400" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-600">
            We couldn't find any {type} for "{searchTerm}". Try adjusting your search terms.
          </p>
        </div>
      </div>
    </div>
  );
};
