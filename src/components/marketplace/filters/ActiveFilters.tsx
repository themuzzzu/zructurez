
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  activeFilters: string[];
  onRemoveFilter?: (filter: string) => void;
}

export const ActiveFilters = ({ 
  activeFilters, 
  onRemoveFilter 
}: ActiveFiltersProps) => {
  if (activeFilters.length === 0) return null;
  
  return (
    <div className="mb-2">
      <div className="text-sm text-muted-foreground mb-2">Active Filters:</div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(filter => (
          <Badge key={filter} variant="secondary" className="capitalize px-3 py-1">
            {filter}
            {onRemoveFilter && (
              <button 
                onClick={() => onRemoveFilter(filter)} 
                className="ml-2 hover:text-primary-foreground/80"
              >
                <X size={14} />
              </button>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};
