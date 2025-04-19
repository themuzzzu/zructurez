
import React from "react";
import { Categories } from "./Categories";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export interface CategoryTabContentProps {
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
  showDiscounted?: boolean;
  setShowDiscounted?: (value: boolean) => void;
  showUsed?: boolean;
  setShowUsed?: (value: boolean) => void;
  showBranded?: boolean;
  setShowBranded?: (value: boolean) => void;
  sortOption?: string;
  setSortOption?: (option: string) => void;
  priceRange?: string;
  setPriceRange?: (range: string) => void;
  resetFilters?: () => void;
  gridLayout?: string;
  setActiveTab?: (tab: string) => void;
}

export const CategoryTabContent: React.FC<CategoryTabContentProps> = ({
  selectedCategory = "all",
  setSelectedCategory,
  showDiscounted = false,
  setShowDiscounted,
  showUsed = false,
  setShowUsed,
  showBranded = false,
  setShowBranded,
  sortOption = "newest",
  setSortOption,
  priceRange = "all",
  setPriceRange,
  resetFilters,
  gridLayout = "grid4x4",
}) => {
  const handleCategorySelect = (category: string) => {
    if (setSelectedCategory) {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="col-span-1">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Categories</h3>
              <Categories onCategorySelect={handleCategorySelect} />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Sort By</h3>
              <RadioGroup 
                value={sortOption} 
                onValueChange={(value) => setSortOption && setSortOption(value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newest" id="newest" />
                  <Label htmlFor="newest">Newest First</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="priceAsc" id="priceAsc" />
                  <Label htmlFor="priceAsc">Price: Low to High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="priceDesc" id="priceDesc" />
                  <Label htmlFor="priceDesc">Price: High to Low</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-2">Product Type</h3>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="discounted" 
                  checked={showDiscounted}
                  onCheckedChange={(checked) => setShowDiscounted && setShowDiscounted(checked === true)}
                />
                <label htmlFor="discounted" className="text-sm">Discounted</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="used" 
                  checked={showUsed}
                  onCheckedChange={(checked) => setShowUsed && setShowUsed(checked === true)}
                />
                <label htmlFor="used" className="text-sm">Used</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="branded" 
                  checked={showBranded}
                  onCheckedChange={(checked) => setShowBranded && setShowBranded(checked === true)}
                />
                <label htmlFor="branded" className="text-sm">Branded</label>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="col-span-1 md:col-span-3">
        <div className="flex items-center justify-center h-60 bg-muted/30 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-medium">Select a Category</h3>
            <p className="text-muted-foreground">Choose a category to view products</p>
          </div>
        </div>
      </div>
    </div>
  );
};
