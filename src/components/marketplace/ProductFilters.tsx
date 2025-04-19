import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useActiveFilters } from "@/components/marketplace/filters/useActiveFilters";

interface ProductFiltersProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  showDiscounted: boolean;
  onDiscountedChange: (value: boolean) => void;
  showUsed: boolean;
  onUsedChange: (value: boolean) => void;
  showBranded: boolean;
  onBrandedChange: (value: boolean) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  onResetFilters: () => void;
}

export const ProductFilters = ({
  selectedCategory,
  onCategorySelect,
  showDiscounted,
  onDiscountedChange,
  showUsed,
  onUsedChange,
  showBranded,
  onBrandedChange,
  sortOption,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  onResetFilters
}: ProductFiltersProps) => {
  // Keep track of which sections are expanded
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    options: true,
    sort: true
  });
  
  const activeFilters = useActiveFilters(
    showDiscounted,
    showUsed,
    showBranded,
    priceRange,
    selectedCategory
  );

  // Categories
  const categories = ["all", "electronics", "fashion", "home", "beauty", "sports", "books", "toys"];

  // Toggle section visibility
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate price range values for the slider
  const getPriceRangeValue = () => {
    switch (priceRange) {
      case 'all': return [0];
      case '0-50': return [25];
      case '50-100': return [75];
      case '100-200': return [150];
      case '200-up': return [250];
      default: return [0];
    }
  };

  const handlePriceRangeChange = (value: number[]) => {
    const val = value[0];
    if (val < 25) onPriceRangeChange('all');
    else if (val < 75) onPriceRangeChange('0-50');
    else if (val < 150) onPriceRangeChange('50-100');
    else if (val < 250) onPriceRangeChange('100-200');
    else onPriceRangeChange('200-up');
  };

  return (
    <div className="space-y-6">
      {/* Active filters indicator */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <X className="h-3 w-3 cursor-pointer" onClick={onResetFilters} />
            </Badge>
          ))}
        </div>
      )}

      {/* Categories section */}
      <Collapsible 
        open={openSections.categories} 
        onOpenChange={() => toggleSection('categories')}
        className="border rounded-lg p-3"
      >
        <CollapsibleTrigger className="flex justify-between items-center w-full">
          <h3 className="font-medium text-sm">Categories</h3>
          {openSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          <RadioGroup value={selectedCategory} onValueChange={onCategorySelect}>
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <RadioGroupItem value={category} id={`category-${category}`} />
                <Label htmlFor={`category-${category}`} className="capitalize">
                  {category === "all" ? "All Categories" : category}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Price range section */}
      <Collapsible 
        open={openSections.price} 
        onOpenChange={() => toggleSection('price')}
        className="border rounded-lg p-3"
      >
        <CollapsibleTrigger className="flex justify-between items-center w-full">
          <h3 className="font-medium text-sm">Price Range</h3>
          {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="mb-4">
            <Slider
              value={getPriceRangeValue()}
              max={300}
              step={25}
              onValueChange={handlePriceRangeChange}
            />
          </div>
          <div className="grid grid-cols-5 text-xs text-muted-foreground">
            <span>Any</span>
            <span>$50</span>
            <span>$100</span>
            <span>$200</span>
            <span>$200+</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Additional options section */}
      <Collapsible 
        open={openSections.options} 
        onOpenChange={() => toggleSection('options')}
        className="border rounded-lg p-3"
      >
        <CollapsibleTrigger className="flex justify-between items-center w-full">
          <h3 className="font-medium text-sm">Options</h3>
          {openSections.options ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-discounted">Discounted items</Label>
            <Switch
              id="show-discounted"
              checked={showDiscounted}
              onCheckedChange={onDiscountedChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-used">Used items</Label>
            <Switch
              id="show-used" 
              checked={showUsed}
              onCheckedChange={onUsedChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-branded">Branded items</Label>
            <Switch
              id="show-branded" 
              checked={showBranded}
              onCheckedChange={onBrandedChange}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Sort options section */}
      <Collapsible 
        open={openSections.sort} 
        onOpenChange={() => toggleSection('sort')}
        className="border rounded-lg p-3"
      >
        <CollapsibleTrigger className="flex justify-between items-center w-full">
          <h3 className="font-medium text-sm">Sort By</h3>
          {openSections.sort ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          <RadioGroup value={sortOption} onValueChange={onSortChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="newest" id="sort-newest" />
              <Label htmlFor="sort-newest">Newest First</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-low" id="sort-price-low" />
              <Label htmlFor="sort-price-low">Price: Low to High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-high" id="sort-price-high" />
              <Label htmlFor="sort-price-high">Price: High to Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="most-viewed" id="sort-most-viewed" />
              <Label htmlFor="sort-most-viewed">Most Viewed</Label>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Reset filters button */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={onResetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
};
