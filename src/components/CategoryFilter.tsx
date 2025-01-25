import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

interface CategoryFilterProps {
  categories?: string[];
  selectedCategory?: string;
  onCategorySelect: (category: string) => void;
  onJobTypeSelect: Dispatch<SetStateAction<string | null>>;
  onSalaryRangeSelect: Dispatch<SetStateAction<string | null>>;
  onLocationSelect: Dispatch<SetStateAction<string>>;
  selectedLocation: string;
}

export const CategoryFilter = ({ 
  categories = [],
  selectedCategory = "all",
  onCategorySelect,
  onJobTypeSelect,
  onSalaryRangeSelect,
  onLocationSelect,
  selectedLocation
}: CategoryFilterProps) => {
  const jobTypes = ["all", "government", "local", "mnc"];
  const salaryRanges = ["all", "0-50000", "50000-100000", "100000-150000", "150000+"];

  return (
    <div className="flex flex-wrap gap-4">
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

      <Select defaultValue="all" onValueChange={(value) => onJobTypeSelect(value as string)}>
        <SelectTrigger className="w-[200px] min-w-[200px]">
          <SelectValue placeholder="Job Type" />
        </SelectTrigger>
        <SelectContent className="min-w-[200px]">
          {jobTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type === "all" ? "All Types" : 
               type === "mnc" ? "MNC" : 
               type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue="all" onValueChange={(value) => onSalaryRangeSelect(value as string)}>
        <SelectTrigger className="w-[200px] min-w-[200px]">
          <SelectValue placeholder="Salary Range" />
        </SelectTrigger>
        <SelectContent className="min-w-[200px]">
          {salaryRanges.map((range) => (
            <SelectItem key={range} value={range}>
              {range === "all" ? "All Ranges" : `$${range}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedLocation} onValueChange={onLocationSelect}>
        <SelectTrigger className="w-[200px] min-w-[200px]">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent className="min-w-[200px]">
          <SelectItem value="">All Locations</SelectItem>
          <SelectItem value="san francisco">San Francisco</SelectItem>
          <SelectItem value="new york">New York</SelectItem>
          <SelectItem value="los angeles">Los Angeles</SelectItem>
          <SelectItem value="washington">Washington DC</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};