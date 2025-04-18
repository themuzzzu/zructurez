
import React from 'react';
import { SearchResult } from '@/types/search';
import { Link } from 'react-router-dom';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4 p-4 bg-muted/30 rounded-lg animate-pulse">
            <div className="h-16 w-16 bg-muted rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return <p className="text-muted-foreground py-2">No results found</p>;
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Link to={result.url} key={result.id} className="flex gap-4 p-4 hover:bg-muted/50 rounded-lg cursor-pointer block">
          {result.imageUrl ? (
            <div className="h-16 w-16 bg-muted rounded-lg overflow-hidden">
              <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              No img
            </div>
          )}
          <div>
            <h3 className="font-medium">{result.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{result.description}</p>
            {result.price !== undefined && (
              <div className="mt-1 text-sm font-medium">
                ₹{result.price.toLocaleString()}
                {result.isSponsored && <span className="ml-2 text-xs text-muted-foreground">Sponsored</span>}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};
