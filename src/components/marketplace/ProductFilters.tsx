
import { useState } from "react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [openSort, setOpenSort] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openType, setOpenType] = useState(true);
  const [openBrands, setOpenBrands] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRangeValue, setPriceRangeValue] = useState<[number, number]>([0, 5000]);
  
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

  const brands = [
    "Apple", "Samsung", "Sony", "Nike", "Adidas", "LG", "HP", "Dell", "Asus", 
    "Lenovo", "Puma", "Zara", "H&M", "Ikea", "Philips"
  ];

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRangeValue(value);
    // Format price range as "min-max" or "min" if max is at the upper limit
    const rangeString = value[1] >= 5000 
      ? `${value[0]}-up` 
      : `${value[0]}-${value[1]}`;
    onPriceRangeChange(rangeString);
  };

  // Check if any filters are active
  const hasActiveFilters = showDiscounted || showUsed || showBranded || 
    selectedCategory !== 'all' || sortOption !== 'newest' || 
    selectedBrands.length > 0 || 
    priceRangeValue[0] > 0 || priceRangeValue[1] < 5000;

  return (
    <motion.div 
      className="bg-white dark:bg-card rounded-lg border border-border p-4 space-y-6 shadow-sm"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onResetFilters}
            className="text-xs"
          >
            Reset All
          </Button>
        )}
      </div>

      <Separator />
      
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <ScrollArea className="h-[120px]">
          <div className="space-y-1.5 pr-3">
            {categories.map((category) => (
              <div 
                key={category.id}
                className={`py-1.5 px-3 rounded-md cursor-pointer transition-colors ${
                  selectedCategory === category.id 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => onCategorySelect(category.id)}
              >
                {category.name}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <Separator />
      
      <Collapsible open={openSort} onOpenChange={setOpenSort}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
          <h3 className="font-medium">Sort By</h3>
          {openSort ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-1">
          <RadioGroup value={sortOption} onValueChange={onSortChange} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="newest" id="newest" />
              <Label htmlFor="newest">Newest First</Label>
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
        <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
          <h3 className="font-medium">Price Range</h3>
          {openPrice ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-1">
          <div className="space-y-4">
            <Slider
              value={priceRangeValue}
              min={0}
              max={5000}
              step={100}
              onValueChange={(vals) => handlePriceRangeChange(vals as [number, number])}
              className="mt-6"
            />
            <div className="flex justify-between items-center">
              <div className="px-2 py-1 bg-background border border-input rounded text-sm">
                ₹{priceRangeValue[0]}
              </div>
              <div className="px-2 py-1 bg-background border border-input rounded text-sm">
                {priceRangeValue[1] >= 5000 ? "₹5000+" : `₹${priceRangeValue[1]}`}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      <Collapsible open={openType} onOpenChange={setOpenType}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
          <h3 className="font-medium">Product Type</h3>
          {openType ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-1 space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="discounted"
              checked={showDiscounted}
              onCheckedChange={onDiscountedChange}
            />
            <Label htmlFor="discounted">Discounted Products</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="used"
              checked={showUsed}
              onCheckedChange={onUsedChange}
            />
            <Label htmlFor="used">Used Items</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="branded"
              checked={showBranded}
              onCheckedChange={onBrandedChange}
            />
            <Label htmlFor="branded">Branded Products</Label>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      <Collapsible open={openBrands} onOpenChange={setOpenBrands}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
          <h3 className="font-medium">Brands</h3>
          {openBrands ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-1">
          <ScrollArea className="h-[150px] pr-3">
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <Badge
                  key={brand}
                  variant={selectedBrands.includes(brand) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleBrandToggle(brand)}
                >
                  {brand}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
      
      {hasActiveFilters && (
        <div className="pt-2">
          <Button className="w-full" onClick={onResetFilters}>
            Reset Filters
          </Button>
        </div>
      )}
    </motion.div>
  );
};
