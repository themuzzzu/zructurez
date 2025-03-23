
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ProductFiltersProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  showDiscounted: boolean;
  onDiscountedChange: (show: boolean) => void;
  showUsed: boolean;
  onUsedChange: (show: boolean) => void;
  showBranded: boolean;
  onBrandedChange: (show: boolean) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
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
  onPriceRangeChange
}: ProductFiltersProps) => {
  const [openSort, setOpenSort] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openType, setOpenType] = useState(true);
  
  const categories = [
    { id: "all", name: "All" },
    { id: "electronics", name: "Electronics" },
    { id: "clothing", name: "Clothing" },
    { id: "home", name: "Home" },
    { id: "books", name: "Books" },
    { id: "toys", name: "Toys" },
    { id: "beauty", name: "Beauty" },
    { id: "sports", name: "Sports" },
    { id: "automotive", name: "Automotive" },
    { id: "grocery", name: "Grocery" }
  ];

  return (
    <div className="bg-white dark:bg-card rounded-lg border border-border p-4 space-y-6">
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                selectedCategory === category.id 
                  ? 'bg-primary text-white' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <Collapsible open={openSort} onOpenChange={setOpenSort}>
        <CollapsibleTrigger className="flex w-full items-center justify-between mb-2">
          <h3 className="font-medium">Sort By</h3>
          {openSort ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <RadioGroup value={sortOption} onValueChange={onSortChange} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="newest" id="newest" />
              <Label htmlFor="newest">Newest First</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="oldest" id="oldest" />
              <Label htmlFor="oldest">Oldest First</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-low" id="price-low" />
              <Label htmlFor="price-low">Price: Low to High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-high" id="price-high" />
              <Label htmlFor="price-high">Price: High to Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="most-viewed" id="most-viewed" />
              <Label htmlFor="most-viewed">Most Viewed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="best-selling" id="best-selling" />
              <Label htmlFor="best-selling">Best Selling</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="trending" id="trending" />
              <Label htmlFor="trending">Trending</Label>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      <Collapsible open={openPrice} onOpenChange={setOpenPrice}>
        <CollapsibleTrigger className="flex w-full items-center justify-between mb-2">
          <h3 className="font-medium">Price Range</h3>
          {openPrice ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <RadioGroup value={priceRange} onValueChange={onPriceRangeChange} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-prices" />
              <Label htmlFor="all-prices">All Prices</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0-100" id="under-100" />
              <Label htmlFor="under-100">Under ₹100</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="100-500" id="100-500" />
              <Label htmlFor="100-500">₹100 - ₹500</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="500-1000" id="500-1000" />
              <Label htmlFor="500-1000">₹500 - ₹1,000</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1000-5000" id="1000-5000" />
              <Label htmlFor="1000-5000">₹1,000 - ₹5,000</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5000" id="above-5000" />
              <Label htmlFor="above-5000">Above ₹5,000</Label>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      <Collapsible open={openType} onOpenChange={setOpenType}>
        <CollapsibleTrigger className="flex w-full items-center justify-between mb-2">
          <h3 className="font-medium">Product Type</h3>
          {openType ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ToggleGroup type="multiple" className="flex flex-col space-y-2">
            <ToggleGroupItem 
              value="discounted" 
              className="justify-start"
              data-state={showDiscounted ? "on" : "off"}
              onClick={() => onDiscountedChange(!showDiscounted)}
            >
              Discounted Products
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="used" 
              className="justify-start"
              data-state={showUsed ? "on" : "off"}
              onClick={() => onUsedChange(!showUsed)}
            >
              Used Items
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="branded" 
              className="justify-start"
              data-state={showBranded ? "on" : "off"}
              onClick={() => onBrandedChange(!showBranded)}
            >
              Branded Products
            </ToggleGroupItem>
          </ToggleGroup>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
