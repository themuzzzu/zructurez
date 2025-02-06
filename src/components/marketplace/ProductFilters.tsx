import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const categories = [
    { value: "All", label: "All Categories" },
    { value: "Electronics", label: "Electronics" },
    { value: "Clothing", label: "Clothing" },
    { value: "Home", label: "Home & Garden" },
    { value: "Sports", label: "Sports & Outdoors" },
    { value: "Books", label: "Books & Media" },
    { value: "Automotive", label: "Automotive" },
    { value: "Beauty", label: "Beauty & Health" },
    { value: "Toys", label: "Toys & Games" },
    { value: "Jewelry", label: "Jewelry & Watches" },
    { value: "Art", label: "Art & Collectibles" },
    { value: "Food", label: "Food & Beverages" },
    { value: "Music", label: "Musical Instruments" },
    { value: "Pet", label: "Pet Supplies" },
    { value: "Office", label: "Office Supplies" },
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
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-[#111111] border-zinc-800">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="discounted"
            checked={showDiscounted}
            onCheckedChange={onDiscountedChange}
            className="data-[state=checked]:bg-primary"
          />
          <Label htmlFor="discounted" className="text-white">Discounted</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="used"
            checked={showUsed}
            onCheckedChange={onUsedChange}
            className="data-[state=checked]:bg-primary"
          />
          <Label htmlFor="used" className="text-white">Used</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="branded"
            checked={showBranded}
            onCheckedChange={onBrandedChange}
            className="data-[state=checked]:bg-primary"
          />
          <Label htmlFor="branded" className="text-white">Branded</Label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedCategory} onValueChange={onCategorySelect}>
          <SelectTrigger className="w-full sm:w-[200px] bg-[#111111] border-zinc-800 text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-[#111111] border-zinc-800">
            {categories.map((category) => (
              <SelectItem 
                key={category.value} 
                value={category.value}
                className="text-white hover:bg-zinc-800"
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger className="w-full sm:w-[200px] bg-[#111111] border-zinc-800 text-white">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-zinc-800">
            {priceRanges.map((range) => (
              <SelectItem 
                key={range.value} 
                value={range.value}
                className="text-white hover:bg-zinc-800"
              >
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortOption} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-[#111111] border-zinc-800 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-zinc-800">
            <SelectItem value="newest" className="text-white hover:bg-zinc-800">Newest First</SelectItem>
            <SelectItem value="oldest" className="text-white hover:bg-zinc-800">Oldest First</SelectItem>
            <SelectItem value="price-low" className="text-white hover:bg-zinc-800">Price: Low to High</SelectItem>
            <SelectItem value="price-high" className="text-white hover:bg-zinc-800">Price: High to Low</SelectItem>
            <SelectItem value="most-viewed" className="text-white hover:bg-zinc-800">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};