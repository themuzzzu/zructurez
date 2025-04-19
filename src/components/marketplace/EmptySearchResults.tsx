
import { Button } from '@/components/ui/button';
import { Search, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptySearchResultsProps {
  searchTerm?: string;
  onReset?: () => void;
  type?: 'search' | 'category' | 'filter';
}

export function EmptySearchResults({ 
  searchTerm = '', 
  onReset,
  type = 'search'
}: EmptySearchResultsProps) {
  const navigate = useNavigate();
  
  const getMessage = () => {
    switch (type) {
      case 'search':
        return `We couldn't find any results for "${searchTerm}"`;
      case 'category':
        return `No products found in this category`;
      case 'filter':
        return `No products match the selected filters`;
      default:
        return `No products found`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
        {type === 'search' ? (
          <Search className="h-10 w-10 text-muted-foreground" />
        ) : (
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      
      <h3 className="text-xl font-medium mb-2">No results found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {getMessage()}
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        
        {onReset && (
          <Button 
            onClick={onReset} 
            variant="default"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
