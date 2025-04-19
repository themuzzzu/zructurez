
import { AlertCircle } from "lucide-react";

interface EmptySearchResultsProps {
  searchTerm: string;
  type?: 'product' | 'service' | 'business';
}

export function EmptySearchResults({ searchTerm, type = 'product' }: EmptySearchResultsProps) {
  const getMessage = () => {
    switch (type) {
      case 'business':
        return `No businesses found matching "${searchTerm}"`;
      case 'service':
        return `No services found matching "${searchTerm}"`;
      default:
        return `No products found matching "${searchTerm}"`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
      <p className="text-muted-foreground">{getMessage()}</p>
      <p className="text-sm text-muted-foreground mt-2">
        Try adjusting your search or filters to find what you're looking for.
      </p>
    </div>
  );
}

