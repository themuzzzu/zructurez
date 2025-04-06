
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SearchFilters as SearchFiltersType } from "@/types/search";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (newFilters: Partial<SearchFiltersType>) => void;
  onReset?: () => void;
  onTypeChange?: (newType: string) => void;
  selectedType?: string;
}

export function SearchFilters({ filters, onFilterChange, onReset, onTypeChange, selectedType }: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin || 0,
    filters.priceMax || 10000
  ]);
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  const applyPriceRange = () => {
    onFilterChange({
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    });
  };
  
  const categories = [
    { id: 'electronics', label: 'Electronics' },
    { id: 'clothing', label: 'Clothing & Fashion' },
    { id: 'home', label: 'Home & Garden' },
    { id: 'toys', label: 'Toys & Games' },
    { id: 'beauty', label: 'Beauty & Personal Care' }
  ];
  
  const renderCategories = () => {
    return categories.map(category => (
      <div key={category.id} className="flex items-center space-x-2">
        <Checkbox
          id={`category-${category.id}`}
          checked={filters.categories?.includes(category.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              const newCategories = [...(filters.categories || []), category.id];
              onFilterChange({ categories: newCategories });
            } else {
              const newCategories = filters.categories?.filter(id => id !== category.id) || [];
              onFilterChange({ categories: newCategories });
            }
          }}
        />
        <Label htmlFor={`category-${category.id}`}>{category.label}</Label>
      </div>
    ));
  };

  // Define content types if onTypeChange is provided
  const contentTypes = [
    { id: 'all', label: 'All Content' },
    { id: 'product', label: 'Products' },
    { id: 'service', label: 'Services' },
    { id: 'business', label: 'Businesses' }
  ];
  
  // Define the valid sort options as a type
  type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest';
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Type - Only show if onTypeChange is provided */}
        {onTypeChange && (
          <div>
            <h3 className="font-medium mb-2">Content Type</h3>
            <RadioGroup 
              value={selectedType || 'all'} 
              onValueChange={(value) => onTypeChange(value)}
            >
              {contentTypes.map(type => (
                <div key={type.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.id} id={`type-${type.id}`} />
                  <Label htmlFor={`type-${type.id}`}>{type.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <Separator className="mt-4" />
          </div>
        )}
        
        {/* Sort By */}
        <div>
          <h3 className="font-medium mb-2">Sort By</h3>
          <RadioGroup 
            value={filters.sortBy || 'relevance'} 
            onValueChange={(value: SortOption) => onFilterChange({ sortBy: value as SortOption })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="relevance" id="sort-relevance" />
              <Label htmlFor="sort-relevance">Relevance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-asc" id="sort-price-asc" />
              <Label htmlFor="sort-price-asc">Price: Low to High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-desc" id="sort-price-desc" />
              <Label htmlFor="sort-price-desc">Price: High to Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="newest" id="sort-newest" />
              <Label htmlFor="sort-newest">Newest First</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-2">Price Range</h3>
          <div className="space-y-4">
            <Slider
              min={0}
              max={10000}
              step={100}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="mb-6"
            />
            <div className="flex justify-between text-sm">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
            <Button variant="outline" size="sm" onClick={applyPriceRange}>
              Apply
            </Button>
          </div>
        </div>
        
        <Separator />
        
        {/* Categories */}
        <div>
          <h3 className="font-medium mb-2">Categories</h3>
          <div className="space-y-2">
            {renderCategories()}
          </div>
        </div>
        
        <Separator />
        
        {/* Additional Filters */}
        <div>
          <h3 className="font-medium mb-2">Additional Filters</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-sponsored"
                checked={filters.includeSponsored}
                onCheckedChange={(checked) => onFilterChange({ includeSponsored: !!checked })}
              />
              <Label htmlFor="show-sponsored">Show sponsored results</Label>
            </div>
          </div>
        </div>
        
        {onReset && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onReset}
          >
            Reset All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
