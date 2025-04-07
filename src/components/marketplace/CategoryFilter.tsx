
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange
}: CategoryFilterProps) => {
  const categories = [
    { value: null, label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing & Fashion" },
    { value: "home", label: "Home & Garden" },
    { value: "sports", label: "Sports & Outdoors" },
    { value: "toys", label: "Toys & Games" },
    { value: "beauty", label: "Beauty & Health" },
    { value: "books", label: "Books & Media" },
    { value: "automotive", label: "Automotive" },
    { value: "jewelry", label: "Jewelry" },
  ];

  const handleValueChange = (value: string) => {
    onCategoryChange(value === "all" ? null : value);
  };

  return (
    <div className="w-full max-w-xs">
      <Select 
        value={selectedCategory || "all"} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.value || "all"} value={category.value || "all"}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
