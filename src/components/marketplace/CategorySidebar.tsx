
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface CategorySidebarProps {
  subcategories?: string[];
  onSubcategorySelect?: (subcategory: string) => void;
  selectedSubcategory?: string;
  priceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
  brands?: string[];
  onBrandSelect?: (brand: string, selected: boolean) => void;
  selectedBrands?: string[];
}

export const CategorySidebar = ({
  subcategories = [],
  onSubcategorySelect,
  selectedSubcategory,
  priceRange = [0, 5000],
  onPriceRangeChange,
  brands = [],
  onBrandSelect,
  selectedBrands = []
}: CategorySidebarProps) => {
  const [expandedFilters, setExpandedFilters] = useState({
    subcategories: true,
    price: true,
    brands: true,
    rating: false,
    availability: false
  });

  const toggleFilter = (filter: keyof typeof expandedFilters) => {
    setExpandedFilters({
      ...expandedFilters,
      [filter]: !expandedFilters[filter]
    });
  };

  return (
    <div className="w-full md:max-w-[240px] space-y-6">
      {subcategories.length > 0 && (
        <div>
          <div 
            className="flex justify-between items-center cursor-pointer mb-3" 
            onClick={() => toggleFilter('subcategories')}
          >
            <h3 className="font-medium">Subcategories</h3>
            {expandedFilters.subcategories ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
          
          {expandedFilters.subcategories && (
            <div className="space-y-2">
              {subcategories.map((sub) => (
                <Button
                  key={sub}
                  variant="ghost"
                  onClick={() => onSubcategorySelect?.(sub)}
                  className={`justify-start px-2 w-full h-auto py-1 text-left ${
                    selectedSubcategory === sub ? 'bg-muted font-medium' : ''
                  }`}
                >
                  {sub}
                </Button>
              ))}
            </div>
          )}
          <Separator className="my-4" />
        </div>
      )}
      
      <div>
        <div 
          className="flex justify-between items-center cursor-pointer mb-3" 
          onClick={() => toggleFilter('price')}
        >
          <h3 className="font-medium">Price Range</h3>
          {expandedFilters.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        
        {expandedFilters.price && (
          <div className="space-y-4">
            <Slider
              defaultValue={priceRange}
              max={5000}
              step={100}
              onValueChange={(value) => onPriceRangeChange?.(value as [number, number])}
            />
            <div className="flex justify-between">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        )}
        <Separator className="my-4" />
      </div>
      
      {brands.length > 0 && (
        <div>
          <div 
            className="flex justify-between items-center cursor-pointer mb-3" 
            onClick={() => toggleFilter('brands')}
          >
            <h3 className="font-medium">Brands</h3>
            {expandedFilters.brands ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
          
          {expandedFilters.brands && (
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${brand}`} 
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => onBrandSelect?.(brand, checked as boolean)}
                  />
                  <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySidebar;
