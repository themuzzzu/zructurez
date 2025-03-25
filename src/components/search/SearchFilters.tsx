
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Reset } from "lucide-react";
import { SearchFilters as SearchFiltersType } from "@/types/search";
import { supabase } from "@/integrations/supabase/client";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onChange: (filters: Partial<SearchFiltersType>) => void;
  onReset: () => void;
}

export function SearchFilters({ filters, onChange, onReset }: SearchFiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin || 0,
    filters.priceMax || 50000
  ]);
  
  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);
        
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
    };
    
    fetchCategories();
  }, []);
  
  // Handle category selection
  const handleCategoryChange = (category: string, checked: boolean) => {
    let newCategories = [...(filters.categories || [])];
    
    if (checked) {
      newCategories.push(category);
    } else {
      newCategories = newCategories.filter(c => c !== category);
    }
    
    onChange({ categories: newCategories });
  };
  
  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  // Apply price range after sliding ends
  const handlePriceRangeCommit = () => {
    onChange({
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Filters</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset}
              className="h-8 px-2"
            >
              <Reset className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {/* Sorting options */}
            <div>
              <h3 className="font-medium mb-3">Sort By</h3>
              <RadioGroup 
                value={filters.sortBy || 'relevance'}
                onValueChange={(value) => onChange({ sortBy: value as any })}
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
            
            {/* Price range */}
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  min={0}
                  max={50000}
                  step={500}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceRangeChange}
                  onValueCommit={handlePriceRangeCommit}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Categories */}
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={(filters.categories || []).includes(category)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`category-${category}`}
                      className="text-sm capitalize"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sponsored content toggle */}
            <div>
              <h3 className="font-medium mb-3">Sponsored Content</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sponsored"
                  checked={filters.includeSponsored}
                  onCheckedChange={(checked) => 
                    onChange({ includeSponsored: checked as boolean })
                  }
                />
                <Label htmlFor="sponsored">Show sponsored results</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
