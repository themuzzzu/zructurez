
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ProductFiltersProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  showDiscounted: boolean;
  onDiscountedChange: (checked: boolean) => void;
  showUsed: boolean;
  onUsedChange: (checked: boolean) => void;
  showBranded: boolean;
  onBrandedChange: (checked: boolean) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
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
}: ProductFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // When filters change, update the active filters array
  useEffect(() => {
    const filters = [];
    if (showDiscounted) filters.push('discounted');
    if (showUsed) filters.push('used');
    if (showBranded) filters.push('branded');
    if (priceRange !== 'all') filters.push('price');
    if (selectedCategory !== 'all') filters.push('category');
    setActiveFilters(filters);
  }, [showDiscounted, showUsed, showBranded, priceRange, selectedCategory]);
  
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "mobiles", label: "Mobiles" },
    { value: "tvs", label: "TVs & Appliances" },
    { value: "fashion", label: "Fashion" },
    { value: "computers", label: "Computers" },
    { value: "baby", label: "Baby & Kids" },
    { value: "home", label: "Home & Furniture" },
    { value: "books", label: "Books & Education" },
    { value: "sports", label: "Sports & Fitness" },
    { value: "grocery", label: "Grocery" },
    { value: "auto", label: "Auto Accessories" },
    { value: "gifts", label: "Gifts & Toys" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-500", label: "Under ₹500" },
    { value: "500-1000", label: "₹500 - ₹1,000" },
    { value: "1000-5000", label: "₹1,000 - ₹5,000" },
    { value: "5000-10000", label: "₹5,000 - ₹10,000" },
    { value: "10000-25000", label: "₹10,000 - ₹25,000" },
    { value: "25000", label: "Above ₹25,000" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card border-border">
      {activeFilters.length > 0 && (
        <div className="mb-2">
          <div className="text-sm text-muted-foreground mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(filter => (
              <Badge key={filter} variant="secondary" className="capitalize">
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <Accordion type="multiple" className="w-full" defaultValue={["product-type", "price", "category", "sort"]}>
        <AccordionItem value="product-type">
          <AccordionTrigger>Product Type</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="discounted"
                  checked={showDiscounted}
                  onCheckedChange={onDiscountedChange}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="discounted" className="text-foreground">Discounted</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="used"
                  checked={showUsed}
                  onCheckedChange={onUsedChange}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="used" className="text-foreground">Used</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="branded"
                  checked={showBranded}
                  onCheckedChange={onBrandedChange}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="branded" className="text-foreground">Branded</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <Select value={selectedCategory} onValueChange={onCategorySelect}>
              <SelectTrigger className="w-full border-border text-foreground">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {categories.map((category) => (
                  <SelectItem 
                    key={category.value} 
                    value={category.value}
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <Select value={priceRange} onValueChange={onPriceRangeChange}>
              <SelectTrigger className="w-full border-border text-foreground">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem 
                    key={range.value} 
                    value={range.value}
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="sort">
          <AccordionTrigger>Sort By</AccordionTrigger>
          <AccordionContent>
            <Select value={sortOption} onValueChange={onSortChange}>
              <SelectTrigger className="w-full border-border text-foreground">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="most-viewed">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-2" />
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        onClick={() => {
          onCategorySelect('all');
          onDiscountedChange(false);
          onUsedChange(false);
          onBrandedChange(false);
          onSortChange('newest');
          onPriceRangeChange('all');
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );
};
