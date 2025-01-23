import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFiltersProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  showDiscounted: boolean;
  onDiscountedChange: () => void;
  showUsed: boolean;
  onUsedChange: () => void;
  showBranded: boolean;
  onBrandedChange: () => void;
  sortOption: string;
  onSortChange: (value: string) => void;
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
}: ProductFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-6 items-center justify-between p-4 border rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="discounted"
              checked={showDiscounted}
              onCheckedChange={onDiscountedChange}
            />
            <Label htmlFor="discounted">Discounted</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="used"
              checked={showUsed}
              onCheckedChange={onUsedChange}
            />
            <Label htmlFor="used">Used</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="branded"
              checked={showBranded}
              onCheckedChange={onBrandedChange}
            />
            <Label htmlFor="branded">Branded</Label>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={selectedCategory} onValueChange={onCategorySelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Clothing">Clothing</SelectItem>
            <SelectItem value="Home">Home & Garden</SelectItem>
            <SelectItem value="Sports">Sports</SelectItem>
            <SelectItem value="Books">Books</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOption} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};