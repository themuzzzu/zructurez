
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { SearchFilters } from "@/types/search";
import { useState } from "react";

interface ImprovedSearchFiltersProps {
  filters: SearchFilters;
  onChange: (newFilters: Partial<SearchFilters>) => void;
  onReset: () => void;
}

export function ImprovedSearchFilters({ filters, onChange, onReset }: ImprovedSearchFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin || 0,
    filters.priceMax || 10000
  ]);

  const categories = [
    { id: "electronics", label: "Electronics" },
    { id: "fashion", label: "Fashion & Clothing" },
    { id: "home", label: "Home & Living" },
    { id: "beauty", label: "Beauty & Health" },
    { id: "sports", label: "Sports & Fitness" }
  ];

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Categories</h3>
          <div className="space-y-3">
            {categories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categories?.includes(category.id)}
                  onCheckedChange={(checked) => {
                    const newCategories = checked
                      ? [...(filters.categories || []), category.id]
                      : filters.categories?.filter(id => id !== category.id);
                    onChange({ categories: newCategories });
                  }}
                />
                <Label 
                  htmlFor={`category-${category.id}`}
                  className="text-sm"
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium text-sm">Price Range</h3>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
            onValueCommit={(value) => {
              onChange({
                priceMin: value[0],
                priceMax: value[1]
              });
            }}
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
