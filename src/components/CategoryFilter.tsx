import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Flame, Clock, ThumbsUp, TrendingUp, Briefcase, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationSelector } from "@/components/LocationSelector";

interface CategoryFilterProps {
  onCategorySelect: (category: string | null) => void;
  onSortChange?: (sort: string) => void;
  onJobTypeSelect?: (type: string | null) => void;
  onSalaryRangeSelect?: (range: string | null) => void;
  onLocationSelect?: (location: string) => void;
  selectedLocation?: string;
}

export const CategoryFilter = ({ 
  onCategorySelect, 
  onSortChange, 
  onJobTypeSelect,
  onSalaryRangeSelect,
  onLocationSelect,
  selectedLocation = ""
}: CategoryFilterProps) => {
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

  const jobTypes = [
    { id: "government", label: "Government Jobs" },
    { id: "local", label: "Local Jobs" },
    { id: "mnc", label: "MNC Jobs" },
  ];

  const salaryRanges = [
    { value: "0-50000", label: "Up to $50,000" },
    { value: "50000-100000", label: "$50,000 - $100,000" },
    { value: "100000-150000", label: "$100,000 - $150,000" },
    { value: "150000+", label: "$150,000+" },
  ];

  return (
    <div className="flex flex-col gap-4">
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
      
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onJobTypeSelect?.(null)}
            className="flex items-center gap-1"
          >
            <Briefcase className="h-4 w-4" />
            All Jobs
          </Button>
          {jobTypes.map((jobType) => (
            <Button
              key={jobType.id}
              variant="outline"
              size="sm"
              onClick={() => onJobTypeSelect?.(jobType.id)}
              className="flex items-center gap-1"
            >
              <Briefcase className="h-4 w-4" />
              {jobType.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <Select onValueChange={onSalaryRangeSelect}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <SelectValue placeholder="Salary Range" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Salary Ranges</SelectItem>
              {salaryRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <LocationSelector
            value={selectedLocation}
            onChange={onLocationSelect || (() => {})}
          />
        </div>
      </div>
    </div>
  );
};