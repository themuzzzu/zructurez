
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type SearchResult } from "@/types/search";
import { ArrowUpRight, Star, Info, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick?: (result: SearchResult) => void;
  isLoading?: boolean;
  correctedQuery?: string;
  originalQuery?: string;
}

export function SearchResults({
  results,
  onResultClick,
  isLoading = false,
  correctedQuery,
  originalQuery,
}: SearchResultsProps) {
  const navigate = useNavigate();
  
  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    }
    navigate(result.url);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-lg text-muted-foreground">No results found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try different keywords or filters
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {correctedQuery && originalQuery && originalQuery !== correctedQuery && (
        <div className="p-2 text-sm text-muted-foreground">
          Showing results for <strong>{correctedQuery}</strong> instead of <span className="italic">{originalQuery}</span>
        </div>
      )}
      
      {results.map((result) => (
        <Card 
          key={result.id}
          className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
            result.isSponsored ? 'border-yellow-200 dark:border-yellow-800' : ''
          }`}
          onClick={() => handleResultClick(result)}
        >
          <div className="flex gap-4">
            {result.imageUrl ? (
              <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={result.imageUrl}
                  alt={result.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 shrink-0 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Tag className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-foreground truncate mr-2">
                  {result.title}
                </h3>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {result.description}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                {result.type && (
                  <Badge variant="outline" className="text-xs">
                    {result.type}
                  </Badge>
                )}
                
                {result.category && (
                  <Badge variant="secondary" className="text-xs">
                    {result.category}
                  </Badge>
                )}
                
                {result.price && (
                  <span className="text-sm font-medium">
                    ₹{result.price.toLocaleString()}
                  </span>
                )}
                
                {result.isSponsored && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 ml-auto">
                          <Info className="h-3 w-3 mr-1" />
                          Sponsored
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">This is a sponsored result</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
