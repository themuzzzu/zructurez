
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterSortByProps {
  sortOption: string;
  onSortChange: (value: string) => void;
}

export const FilterSortBy = ({
  sortOption,
  onSortChange,
}: FilterSortByProps) => {
  return (
    <Select value={sortOption} onValueChange={onSortChange}>
      <SelectTrigger className="w-full border-border text-foreground">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
        <SelectItem value="most-viewed">Most Viewed</SelectItem>
      </SelectContent>
    </Select>
  );
};
