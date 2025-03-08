
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterCategoriesProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const FilterCategories = ({
  selectedCategory,
  onCategorySelect,
}: FilterCategoriesProps) => {
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

  return (
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
  );
};
