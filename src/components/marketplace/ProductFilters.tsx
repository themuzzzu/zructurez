import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Check, Tags, Recycle } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Electronics",
  "Groceries",
  "Home & Kitchen",
  "Fashion",
  "Beauty & Personal Care",
  "Health & Wellness",
  "Baby Products",
  "Toys & Games",
  "Sports & Outdoors",
  "Books & Media",
  "Automotive",
  "Pet Supplies",
  "Office Products",
  "Tools & Home Improvement",
  "Garden & Outdoor",
  "Furniture",
  "Appliances",
  "Arts & Crafts",
  "Jewelry",
  "Food & Beverages",
  "Industrial & Scientific"
];

interface ProductFiltersProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  showDiscounted: boolean;
  onDiscountedChange: () => void;
  showUsed: boolean;
  onUsedChange: () => void;
}

export const ProductFilters = ({
  selectedCategory,
  onCategorySelect,
  showDiscounted,
  onDiscountedChange,
  showUsed,
  onUsedChange,
}: ProductFiltersProps) => {
  return (
    <div className="space-y-4">
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex w-max space-x-2 p-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="text-sm"
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2",
            showDiscounted && "bg-primary text-primary-foreground"
          )}
          onClick={onDiscountedChange}
        >
          <Tags className="h-4 w-4" />
          Discounted
          {showDiscounted && <Check className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2",
            showUsed && "bg-primary text-primary-foreground"
          )}
          onClick={onUsedChange}
        >
          <Recycle className="h-4 w-4" />
          Used Products
          {showUsed && <Check className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};