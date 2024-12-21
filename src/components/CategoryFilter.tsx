import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
  "All",
  "General",
  "News",
  "Events",
  "Questions",
  "Recommendations",
  "Lost & Found",
  "Safety",
  "Community",
];

interface CategoryFilterProps {
  onCategorySelect: (category: string | null) => void;
}

export const CategoryFilter = ({ onCategorySelect }: CategoryFilterProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 p-1">
        {categories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            className="text-sm"
            onClick={() => onCategorySelect(category === "All" ? null : category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};