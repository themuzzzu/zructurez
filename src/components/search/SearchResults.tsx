
import React from 'react';
import { SearchResult } from '@/types/search';
import { Link } from 'react-router-dom';
import { GridLayoutType } from '@/components/products/types/ProductTypes';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  layout?: GridLayoutType;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading,
  layout = "grid4x4"
}) => {
  const getGridClasses = () => {
    switch (layout) {
      case "grid2x2":
        return "grid-cols-1 sm:grid-cols-2 gap-4";
      case "grid3x3":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
      case "list":
        return "flex flex-col gap-4";
      case "grid4x4":
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    }
  };

  if (isLoading) {
    return (
      <div className={`grid ${getGridClasses()}`}>
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
    <div className={`grid ${getGridClasses()}`}>
      {results.map((result) => (
        <Link 
          to={result.url} 
          key={result.id} 
          className={`${
            layout === 'list' 
              ? 'flex gap-4' 
              : 'flex flex-col'
          } p-4 hover:bg-muted/50 rounded-lg cursor-pointer block`}
        >
          {result.imageUrl ? (
            <div className={`${
              layout === 'list' 
                ? 'h-16 w-16' 
                : 'w-full aspect-square'
              } bg-muted rounded-lg overflow-hidden`}
            >
              <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className={`${
              layout === 'list' 
                ? 'h-16 w-16' 
                : 'w-full aspect-square'
              } bg-muted rounded-lg flex items-center justify-center text-muted-foreground`}
            >
              No img
            </div>
          )}
          <div className={layout === 'list' ? '' : 'mt-3'}>
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
