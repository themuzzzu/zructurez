import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Flame, Clock, ThumbsUp, TrendingUp } from "lucide-react";

interface CategoryFilterProps {
  onCategorySelect: (category: string | null) => void;
  onSortChange?: (sort: string) => void;
}

export const CategoryFilter = ({ onCategorySelect, onSortChange }: CategoryFilterProps) => {
  const categories = [
    "General",
    "Events",
    "News",
    "Questions",
    "Recommendations",
    "Lost & Found",
    "Community",
    "Services",
  ];

  const handleSortChange = (sort: string) => {
    onSortChange?.(sort);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 pb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSortChange('trending')}
          className="flex items-center gap-1"
        >
          <Flame className="h-4 w-4 text-orange-500" />
          Trending
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSortChange('latest')}
          className="flex items-center gap-1"
        >
          <Clock className="h-4 w-4" />
          Latest
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSortChange('top')}
          className="flex items-center gap-1"
        >
          <ThumbsUp className="h-4 w-4" />
          Top
        </Button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCategorySelect(null)}
            className="flex items-center gap-1"
          >
            <TrendingUp className="h-4 w-4" />
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};