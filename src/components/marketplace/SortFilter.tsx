
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

interface SortFilterProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortFilter = ({
  selectedSort,
  onSortChange
}: SortFilterProps) => {
  return (
    <div className="w-full max-w-xs">
      <Select value={selectedSort} onValueChange={onSortChange as (value: string) => void}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
