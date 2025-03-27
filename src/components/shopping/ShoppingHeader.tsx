
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";

interface ShoppingHeaderProps {
  selectedCategory: string | null;
  onOpenAddProductDialog: () => void;
  onToggleMobileFilters: () => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  hasActiveFilters: boolean;
}

export const ShoppingHeader = ({
  selectedCategory,
  onOpenAddProductDialog,
  onToggleMobileFilters,
  sortOption,
  onSortChange,
  hasActiveFilters
}: ShoppingHeaderProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-between items-center bg-white dark:bg-zinc-800 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold hidden sm:block">
          {selectedCategory && selectedCategory !== 'all' 
            ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products` 
            : 'All Products'}
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          className="sm:hidden flex items-center gap-1"
          onClick={onToggleMobileFilters}
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
          <Select value={sortOption} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="most-viewed">Most Viewed</SelectItem>
              <SelectItem value="best-selling">Best Selling</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={onOpenAddProductDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
    </div>
  );
};
