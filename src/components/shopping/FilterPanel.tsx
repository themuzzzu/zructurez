
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FilterPanelProps {
  selectedCategory: string | null;
  showDiscounted: boolean;
  showUsed: boolean;
  showBranded: boolean;
  sortOption: string;
  priceRange: string;
  onDiscountedChange: (checked: boolean) => void;
  onUsedChange: (checked: boolean) => void;
  onBrandedChange: (checked: boolean) => void;
  onSortChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
  onCloseMobileFilter: () => void;
  isFilterMobileOpen: boolean;
  children?: React.ReactNode; // Add children prop
}

export const FilterPanel = ({
  selectedCategory,
  showDiscounted,
  showUsed,
  showBranded,
  sortOption,
  priceRange,
  onDiscountedChange,
  onUsedChange,
  onBrandedChange,
  onSortChange,
  onPriceRangeChange,
  onCloseMobileFilter,
  isFilterMobileOpen,
  children
}: FilterPanelProps) => {
  if (!isFilterMobileOpen) return null;

  return (
    <div className="block sm:hidden bg-white dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Filters</h3>
        <Button variant="ghost" size="icon" onClick={onCloseMobileFilter}>
          <X size={16} />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Sort by</label>
          <Select value={sortOption} onValueChange={onSortChange}>
            <SelectTrigger className="w-full">
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
        
        <div>
          <Label className="text-sm font-medium mb-1 block">Product Types</Label>
          <div className="space-y-2 mt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="discounted-mobile"
                checked={showDiscounted}
                onCheckedChange={onDiscountedChange}
              />
              <Label htmlFor="discounted-mobile">Discounted</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="used-mobile"
                checked={showUsed}
                onCheckedChange={onUsedChange}
              />
              <Label htmlFor="used-mobile">Used</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="branded-mobile"
                checked={showBranded}
                onCheckedChange={onBrandedChange}
              />
              <Label htmlFor="branded-mobile">Branded</Label>
            </div>
          </div>
        </div>
        
        {/* Render children if provided */}
        {children}
      </div>
    </div>
  );
};
