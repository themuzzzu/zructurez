import { useState } from "react";
import { SearchFilters } from "@/types/search";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MarketplaceSearchFiltersProps {
  onChange: (newFilters: Partial<SearchFilters>) => void;
  onReset: () => void;
}

export function MarketplaceSearchFilters({ 
  onChange,
  onReset
}: MarketplaceSearchFiltersProps) {
  // State for local filters before applying
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc" | "newest" | "popularity">("relevance");
  const [includeSponsored, setIncludeSponsored] = useState(true);
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);
  const [ratings, setRatings] = useState<number[]>([]);
  const [openSections, setOpenSections] = useState({
    sort: true,
    price: true,
    categories: true,
    ratings: false,
    other: false
  });
  
  // Toggle section visibility
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Apply all filters at once
  const applyFilters = () => {
    onChange({
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      sortBy,
      includeSponsored
    });
  };
  
  // Reset all local filter states
  const handleReset = () => {
    setPriceRange([0, 10000]);
    setSelectedCategories([]);
    setSortBy("relevance");
    setIncludeSponsored(true);
    setShowDiscountedOnly(false);
    setRatings([]);
    onReset();
  };
  
  // Handle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  // Handle rating filter
  const toggleRating = (rating: number) => {
    setRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating) 
        : [...prev, rating]
    );
  };
  
  // Available categories
  const categories = [
    { id: 'electronics', label: 'Electronics & Gadgets' },
    { id: 'clothing', label: 'Clothing & Fashion' },
    { id: 'home', label: 'Home & Kitchen' },
    { id: 'beauty', label: 'Beauty & Personal Care' },
    { id: 'sports', label: 'Sports & Fitness' },
    { id: 'toys', label: 'Toys & Games' },
    { id: 'books', label: 'Books & Media' },
    { id: 'automotive', label: 'Automotive' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Sort By Section */}
      <Collapsible open={openSections.sort} onOpenChange={() => toggleSection("sort")}>
        <CollapsibleTrigger className="flex w-full items-center justify-between font-medium text-base py-1">
          <span>Sort By</span>
          {openSections.sort ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <RadioGroup 
            value={sortBy} 
            onValueChange={(value: "relevance" | "price-asc" | "price-desc" | "newest" | "popularity") => {
              setSortBy(value);
              onChange({ sortBy: value });
            }}
            className="space-y-1.5"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="relevance" id="sort-relevance" />
              <Label htmlFor="sort-relevance" className="text-sm cursor-pointer">Relevance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="popularity" id="sort-popularity" />
              <Label htmlFor="sort-popularity" className="text-sm cursor-pointer">Popularity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-asc" id="sort-price-asc" />
              <Label htmlFor="sort-price-asc" className="text-sm cursor-pointer">Price: Low to High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-desc" id="sort-price-desc" />
              <Label htmlFor="sort-price-desc" className="text-sm cursor-pointer">Price: High to Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="newest" id="sort-newest" />
              <Label htmlFor="sort-newest" className="text-sm cursor-pointer">Newest First</Label>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      {/* Price Range Section */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
        <CollapsibleTrigger className="flex w-full items-center justify-between font-medium text-base py-1">
          <span>Price Range</span>
          {openSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="space-y-4">
            <Slider
              min={0}
              max={10000}
              step={100}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mb-6"
            />
            <div className="flex justify-between text-sm">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onChange({ priceMin: priceRange[0], priceMax: priceRange[1] })}
              className="w-full"
            >
              Apply Price
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      {/* Categories Section */}
      <Collapsible open={openSections.categories} onOpenChange={() => toggleSection("categories")}>
        <CollapsibleTrigger className="flex w-full items-center justify-between font-medium text-base py-1">
          <span>Categories</span>
          {openSections.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="space-y-1.5">
            {categories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => {
                    toggleCategory(category.id);
                    onChange({ 
                      categories: selectedCategories.includes(category.id) 
                        ? selectedCategories.filter(c => c !== category.id) 
                        : [...selectedCategories, category.id]
                    });
                  }}
                />
                <Label 
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer leading-tight"
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      {/* Ratings Section */}
      <Collapsible open={openSections.ratings} onOpenChange={() => toggleSection("ratings")}>
        <CollapsibleTrigger className="flex w-full items-center justify-between font-medium text-base py-1">
          <span>Ratings</span>
          {openSections.ratings ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={ratings.includes(rating)}
                  onCheckedChange={() => toggleRating(rating)}
                />
                <Label 
                  htmlFor={`rating-${rating}`}
                  className="text-sm cursor-pointer flex items-center"
                >
                  <div className="flex">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} fill={true} />
                    ))}
                    {Array.from({ length: 5 - rating }).map((_, i) => (
                      <Star key={i + rating} fill={false} />
                    ))}
                  </div>
                  <span className="ml-1">&amp; Above</span>
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      {/* Other Filters Section */}
      <Collapsible open={openSections.other} onOpenChange={() => toggleSection("other")}>
        <CollapsibleTrigger className="flex w-full items-center justify-between font-medium text-base py-1">
          <span>Other Filters</span>
          {openSections.other ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-discounted"
                checked={showDiscountedOnly}
                onCheckedChange={(checked) => setShowDiscountedOnly(!!checked)}
              />
              <Label htmlFor="show-discounted" className="text-sm cursor-pointer">Discounted Items Only</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-sponsored"
                checked={includeSponsored}
                onCheckedChange={(checked) => {
                  setIncludeSponsored(!!checked);
                  onChange({ includeSponsored: !!checked });
                }}
              />
              <Label htmlFor="include-sponsored" className="text-sm cursor-pointer">Include Sponsored Results</Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="flex-1"
        >
          Reset All
        </Button>
        <Button
          size="sm"
          onClick={applyFilters}
          className="flex-1"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

// Star component for ratings
function Star({ fill }: { fill: boolean }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width="14" 
      height="14" 
      fill={fill ? "currentColor" : "none"} 
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={fill ? "text-amber-500" : "text-gray-300"}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
}
