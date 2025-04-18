
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryNavigationBarProps {
  categories: string[];
  onCategorySelect: (category: string) => void;
  activeCategory?: string; // Make this prop optional with a default value
}

export const CategoryNavigationBar = ({
  categories,
  onCategorySelect,
  activeCategory = "All"
}: CategoryNavigationBarProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === activeCategory ? "default" : "outline"}
            className="px-3 py-1 h-auto text-sm"
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
