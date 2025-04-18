
import { useState, useEffect } from "react";
import { SearchFilters } from "@/types/search";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface MarketplaceSearchFiltersProps {
  filters?: Partial<SearchFilters>;
  onChange: (filters: Partial<SearchFilters>) => void;
  onReset: () => void;
  className?: string;
}

const productCategories = [
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "home", name: "Home & Kitchen" },
  { id: "beauty", name: "Beauty & Personal Care" },
  { id: "books", name: "Books & Stationery" },
  { id: "toys", name: "Toys & Games" },
  { id: "sports", name: "Sports & Outdoors" },
  { id: "grocery", name: "Grocery & Gourmet" }
];

const sortOptions = [
  { id: "relevance", name: "Relevance" },
  { id: "price-asc", name: "Price: Low to High" },
  { id: "price-desc", name: "Price: High to Low" },
  { id: "newest", name: "Newest First" },
  { id: "popularity", name: "Popularity" },
];

export function MarketplaceSearchFilters({ 
  filters = {}, 
  onChange, 
  onReset,
  className
}: MarketplaceSearchFiltersProps) {
  // Local filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.categories || []);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin || 0, 
    filters.priceMax || 10000
  ]);
  const [sortBy, setSortBy] = useState<string>(filters.sortBy || "relevance");
  const [discountedOnly, setDiscountedOnly] = useState<boolean>(false);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "in-stock">("all");
  const [openAccordions, setOpenAccordions] = useState<string[]>(["category", "price", "sort"]);
  
  // Update local state when props change
  useEffect(() => {
    setSelectedCategories(filters.categories || []);
    setPriceRange([filters.priceMin || 0, filters.priceMax || 10000]);
    setSortBy(filters.sortBy || "relevance");
  }, [filters]);
  
  // Handle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  // Handle rating filter selection
  const handleRatingChange = (rating: number) => {
    setRatingFilter(ratingFilter === rating ? null : rating);
  };
  
  // Handle apply filters
  const handleApplyFilters = () => {
    const newFilters: Partial<SearchFilters> = {
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      sortBy: sortBy as SearchFilters["sortBy"],
    };
    
    onChange(newFilters);
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setSortBy("relevance");
    setDiscountedOnly(false);
    setRatingFilter(null);
    setAvailabilityFilter("all");
    onReset();
  };
  
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleResetFilters}
        >
          Reset All
        </Button>
      </div>
      
      <Accordion 
        type="multiple" 
        defaultValue={openAccordions} 
        className="space-y-2"
      >
        {/* Categories */}
        <AccordionItem value="category" className="border rounded-md px-1">
          <AccordionTrigger className="px-3 py-2 hover:no-underline">
            <span className="text-sm font-medium">Categories</span>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-1 pb-2">
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {productCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2 py-1 px-2">
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Price Range */}
        <AccordionItem value="price" className="border rounded-md px-1">
          <AccordionTrigger className="px-3 py-2 hover:no-underline">
            <span className="text-sm font-medium">Price Range</span>
          </AccordionTrigger>
          <AccordionContent className="px-3 pt-2 pb-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">₹{priceRange[0]}</span>
                <span className="text-sm">₹{priceRange[1]}</span>
              </div>
              <Slider
                min={0}
                max={10000}
                step={100}
                value={priceRange}
                onValueChange={(value: [number, number]) => setPriceRange(value)}
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {[1000, 2500, 5000, 7500].map((price) => (
                  <Badge 
                    key={price}
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setPriceRange([0, price])}
                  >
                    Under ₹{price}
                  </Badge>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Sort By */}
        <AccordionItem value="sort" className="border rounded-md px-1">
          <AccordionTrigger className="px-3 py-2 hover:no-underline">
            <span className="text-sm font-medium">Sort By</span>
          </AccordionTrigger>
          <AccordionContent className="px-3 pt-2 pb-1">
            <RadioGroup value={sortBy} onValueChange={setSortBy}>
              <div className="space-y-1">
                {sortOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 py-1">
                    <RadioGroupItem value={option.id} id={`sort-${option.id}`} />
                    <Label htmlFor={`sort-${option.id}`} className="text-sm">
                      {option.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
        
        {/* Customer Ratings */}
        <AccordionItem value="rating" className="border rounded-md px-1">
          <AccordionTrigger className="px-3 py-2 hover:no-underline">
            <span className="text-sm font-medium">Customer Ratings</span>
          </AccordionTrigger>
          <AccordionContent className="px-3 pt-2 pb-4">
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div
                  key={rating}
                  className={`flex items-center space-x-2 py-1 px-2 rounded-md cursor-pointer ${
                    ratingFilter === rating ? "bg-accent/50" : "hover:bg-accent/20"
                  }`}
                  onClick={() => handleRatingChange(rating)}
                >
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm">{rating}+ Stars</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Additional Filters */}
        <AccordionItem value="additional" className="border rounded-md px-1">
          <AccordionTrigger className="px-3 py-2 hover:no-underline">
            <span className="text-sm font-medium">Additional Filters</span>
          </AccordionTrigger>
          <AccordionContent className="px-3 pt-2 pb-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 py-1">
                <Checkbox 
                  id="discounted-only" 
                  checked={discountedOnly}
                  onCheckedChange={(checked) => setDiscountedOnly(!!checked)}
                />
                <Label 
                  htmlFor="discounted-only" 
                  className="text-sm cursor-pointer"
                >
                  Discounted Items Only
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 py-1">
                <RadioGroup 
                  value={availabilityFilter} 
                  onValueChange={(value) => setAvailabilityFilter(value as "all" | "in-stock")}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="filter-all" />
                      <Label htmlFor="filter-all" className="text-sm">Show All Items</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-stock" id="filter-in-stock" />
                      <Label htmlFor="filter-in-stock" className="text-sm">In Stock Only</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-4" />
      
      <Button 
        onClick={handleApplyFilters} 
        className="w-full"
      >
        Apply Filters
      </Button>
    </div>
  );
}
