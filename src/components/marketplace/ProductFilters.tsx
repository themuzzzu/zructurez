
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FilterCategories } from "./filters/FilterCategories";
import { FilterPriceRange } from "./filters/FilterPriceRange";
import { FilterSortBy } from "./filters/FilterSortBy";
import { FilterProductType } from "./filters/FilterProductType";
import { ActiveFilters } from "./filters/ActiveFilters";
import { useActiveFilters } from "./filters/useActiveFilters";

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
  const activeFilters = useActiveFilters(
    showDiscounted,
    showUsed,
    showBranded,
    priceRange,
    selectedCategory
  );
  
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card border-border">
      <ActiveFilters activeFilters={activeFilters} />
      
      <Accordion type="multiple" className="w-full" defaultValue={["product-type", "price", "category", "sort"]}>
        <AccordionItem value="product-type">
          <AccordionTrigger>Product Type</AccordionTrigger>
          <AccordionContent>
            <FilterProductType 
              showDiscounted={showDiscounted}
              onDiscountedChange={onDiscountedChange}
              showUsed={showUsed}
              onUsedChange={onUsedChange}
              showBranded={showBranded}
              onBrandedChange={onBrandedChange}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <FilterCategories 
              selectedCategory={selectedCategory}
              onCategorySelect={onCategorySelect}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <FilterPriceRange 
              priceRange={priceRange}
              onPriceRangeChange={onPriceRangeChange}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="sort">
          <AccordionTrigger>Sort By</AccordionTrigger>
          <AccordionContent>
            <FilterSortBy 
              sortOption={sortOption}
              onSortChange={onSortChange}
            />
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
