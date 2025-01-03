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

  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSortChange?.('trending')}
          className="flex items-center gap-1"
        >
          <Flame className="h-4 w-4 text-orange-500" />
          Trending
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSortChange?.('latest')}
          className="flex items-center gap-1"
        >
          <Clock className="h-4 w-4" />
          Latest
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSortChange?.('top')}
          className="flex items-center gap-1"
        >
          <ThumbsUp className="h-4 w-4" />
          Top
        </Button>
      </div>
      <ScrollArea className="w-full">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCategorySelect(null)}
            className="flex items-center gap-1 whitespace-nowrap"
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
              className="whitespace-nowrap"
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