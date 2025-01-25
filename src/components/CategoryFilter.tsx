import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) => {
  return (
    <Select value={selectedCategory} onValueChange={onCategorySelect}>
      <SelectTrigger className="w-[200px] min-w-[200px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent className="min-w-[200px]">
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};