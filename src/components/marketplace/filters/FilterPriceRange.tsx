
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterPriceRangeProps {
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
}

export const FilterPriceRange = ({
  priceRange,
  onPriceRangeChange,
}: FilterPriceRangeProps) => {
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-500", label: "Under ₹500" },
    { value: "500-1000", label: "₹500 - ₹1,000" },
    { value: "1000-5000", label: "₹1,000 - ₹5,000" },
    { value: "5000-10000", label: "₹5,000 - ₹10,000" },
    { value: "10000-25000", label: "₹10,000 - ₹25,000" },
    { value: "25000", label: "Above ₹25,000" },
  ];

  return (
    <Select value={priceRange} onValueChange={onPriceRangeChange}>
      <SelectTrigger className="w-full border-border text-foreground">
        <SelectValue placeholder="Price Range" />
      </SelectTrigger>
      <SelectContent>
        {priceRanges.map((range) => (
          <SelectItem 
            key={range.value} 
            value={range.value}
          >
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
