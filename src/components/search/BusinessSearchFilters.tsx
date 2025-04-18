
import { SearchFilters } from "@/types/search";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface BusinessSearchFiltersProps {
  filters: Partial<SearchFilters>;
  onChange: (filters: Partial<SearchFilters>) => void;
  onReset: () => void;
}

export function BusinessSearchFilters({ filters, onChange, onReset }: BusinessSearchFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-4 text-sm font-medium">Business Categories</h3>
        <div className="space-y-2">
          {["Retail", "Restaurant", "Technology", "Healthcare", "Manufacturing"].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={category} 
                checked={filters.categories?.includes(category)}
                onCheckedChange={(checked) => {
                  const newCategories = checked 
                    ? [...(filters.categories || []), category]
                    : (filters.categories || []).filter(c => c !== category);
                  onChange({ ...filters, categories: newCategories });
                }}
              />
              <Label htmlFor={category}>{category}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-sm font-medium">Sort By</h3>
        <Select 
          value={filters.sortBy} 
          onValueChange={(value) => onChange({ ...filters, sortBy: value as SearchFilters['sortBy'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <Button 
        onClick={onReset}
        variant="outline"
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );
}
