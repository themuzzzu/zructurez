import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw, Filter, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchFilters as SearchFiltersType } from "@/types/search";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onChange: (newFilters: Partial<SearchFiltersType>) => void;
  onReset: () => void;
}

export function SearchFilters({ filters, onChange, onReset }: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin ?? 0,
    filters.priceMax ?? 10000
  ]);
  const [showPriceInputs, setShowPriceInputs] = useState(false);
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    if (!showPriceInputs) {
      onChange({
        priceMin: value[0],
        priceMax: value[1]
      });
    }
  };
  
  const applyPriceRange = () => {
    onChange({
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    });
  };
  
  const categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Kitchen",
    "Beauty",
    "Toys",
    "Sports",
    "Books",
    "Automotive",
    "Groceries"
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="h-8 px-2"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
      
      {/* Sort by */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Sort By</h4>
        <RadioGroup
          value={filters.sortBy || "relevance"}
          onValueChange={(value) => onChange({ sortBy: value })}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="relevance" id="relevance" />
            <Label htmlFor="relevance">Relevance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-asc" id="price-asc" />
            <Label htmlFor="price-asc">Price: Low to High</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-desc" id="price-desc" />
            <Label htmlFor="price-desc">Price: High to Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="newest" />
            <Label htmlFor="newest">Newest First</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Price Range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Price Range</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowPriceInputs(!showPriceInputs)}
            className="h-6 px-2 text-xs"
          >
            {showPriceInputs ? "Use Slider" : "Custom Range"}
          </Button>
        </div>
        {showPriceInputs ? (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price" className="text-xs">Min</Label>
              <Input
                id="min-price"
                type="number"
                value={priceRange[0]}
                onChange={(e) => {
                  const min = parseInt(e.target.value) || 0;
                  setPriceRange([min, priceRange[1]]);
                }}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="max-price" className="text-xs">Max</Label>
              <Input
                id="max-price"
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  const max = parseInt(e.target.value) || 10000;
                  setPriceRange([priceRange[0], max]);
                }}
                className="h-8"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="col-span-2 mt-1"
              onClick={applyPriceRange}
            >
              Apply Price Range
            </Button>
          </div>
        ) : (
          <div className="pt-2 px-1">
            <Slider
              value={priceRange}
              min={0}
              max={10000}
              step={100}
              onValueChange={handlePriceChange}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1] === 10000 ? '10,000+' : priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Categories */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Categories</h4>
        <ScrollArea className="h-[180px] pr-3">
          <div className="space-y-1">
            {categories.map((category) => (
              <div className="flex items-center space-x-2" key={category}>
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories?.includes(category)}
                  onCheckedChange={(checked) => {
                    const newCategories = [...(filters.categories || [])];
                    if (checked) {
                      newCategories.push(category);
                    } else {
                      const index = newCategories.indexOf(category);
                      if (index !== -1) {
                        newCategories.splice(index, 1);
                      }
                    }
                    onChange({ categories: newCategories });
                  }}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Other filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Other Filters</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-sponsored"
            checked={filters.includeSponsored}
            onCheckedChange={(checked) => {
              onChange({ includeSponsored: !!checked });
            }}
          />
          <Label htmlFor="include-sponsored" className="text-sm">
            Include sponsored results
          </Label>
        </div>
      </div>
      
      {/* Selected filters */}
      {(filters.categories?.length || 
         filters.priceMin !== undefined || 
         filters.priceMax !== undefined || 
         filters.sortBy !== 'relevance' || 
         filters.includeSponsored === false) && (
        <Card className="p-3">
          <h4 className="text-sm font-medium mb-2">Active filters</h4>
          <div className="flex flex-wrap gap-1">
            {filters.sortBy && filters.sortBy !== 'relevance' && (
              <Badge variant="secondary" className="text-xs">
                Sort: {filters.sortBy.replace('-', ' ')}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => onChange({ sortBy: 'relevance' })}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (
              <Badge variant="secondary" className="text-xs">
                Price: {filters.priceMin ?? 0}$ - {filters.priceMax ?? '10,000+'}$
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => onChange({ priceMin: undefined, priceMax: undefined })}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {filters.categories?.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => {
                    const newCategories = filters.categories?.filter(c => c !== category) || [];
                    onChange({ categories: newCategories });
                  }}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            ))}
            
            {filters.includeSponsored === false && (
              <Badge variant="secondary" className="text-xs">
                No sponsored
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => onChange({ includeSponsored: true })}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
