
import { Badge } from "@/components/ui/badge";

interface ActiveFiltersProps {
  activeFilters: string[];
}

export const ActiveFilters = ({ activeFilters }: ActiveFiltersProps) => {
  if (activeFilters.length === 0) return null;
  
  return (
    <div className="mb-2">
      <div className="text-sm text-muted-foreground mb-2">Active Filters:</div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(filter => (
          <Badge key={filter} variant="secondary" className="capitalize">
            {filter}
          </Badge>
        ))}
      </div>
    </div>
  );
};
