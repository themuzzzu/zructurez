
import { Search, Filter, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { SearchFilters as SearchFiltersType } from "@/types/search";
import { useState, useEffect } from "react";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onChange: (filters: Partial<SearchFiltersType>) => void;
  onReset: () => void;
  availableCategories?: string[];
}

export function SearchFilters({
  filters,
  onChange,
  onReset,
  availableCategories = [
    "electronics",
    "clothing",
    "home",
    "sports",
    "books",
    "beauty",
    "toys",
    "grocery"
  ],
}: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin || 0,
    filters.priceMax || 10000
  ]);
  
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    
    if (filters.categories && filters.categories.length > 0) count++;
    if (filters.priceMin !== undefined) count++;
    if (filters.priceMax !== undefined) count++;
    if (filters.sortBy && filters.sortBy !== 'relevance') count++;
    if (filters.location) count++;
    
    setActiveFiltersCount(count);
  }, [filters]);
  
  // Handle price range change
  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };
  
  // Apply price range after slider stops
  const applyPriceRange = () => {
    onChange({
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    });
  };
  
  // Handle category selection
  const toggleCategory = (category: string) => {
    const currentCategories = filters.categories || [];
    
    if (currentCategories.includes(category)) {
      onChange({
        categories: currentCategories.filter(c => c !== category)
      });
    } else {
      onChange({
        categories: [...currentCategories, category]
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
          )}
        </h3>
        
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-muted-foreground h-8 gap-1"
          >
            <XCircle className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
      
      <Accordion type="multiple" defaultValue={["sort", "category", "price"]}>
        <AccordionItem value="sort">
          <AccordionTrigger>Sort by</AccordionTrigger>
          <AccordionContent>
            <Select 
              value={filters.sortBy || "relevance"} 
              onValueChange={(value) => onChange({ sortBy: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by relevance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="category">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <Badge
                  key={category}
                  variant={filters.categories?.includes(category) ? "default" : "outline"}
                  className="cursor-pointer select-none capitalize"
                  onClick={() => toggleCategory(category)}
                >
                  {filters.categories?.includes(category) && (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  {category}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                defaultValue={[priceRange[0], priceRange[1]]}
                max={10000}
                step={100}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={handlePriceChange}
                onValueCommit={applyPriceRange}
              />
              
              <div className="flex items-center justify-between text-sm">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="sponsored">
          <AccordionTrigger>Sponsored Results</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="sponsored-switch">Show sponsored results</Label>
              <Switch
                id="sponsored-switch"
                checked={filters.includeSponsored !== false}
                onCheckedChange={(checked) => onChange({ includeSponsored: checked })}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Sponsored results are marked and may be placed higher in the search results
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
