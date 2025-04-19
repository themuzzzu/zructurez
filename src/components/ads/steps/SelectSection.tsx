
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdSectionType } from "../types";

interface SelectSectionProps {
  value?: AdSectionType;
  onChange: (value: AdSectionType) => void;
}

export const SelectSection = ({ value, onChange }: SelectSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Where would you like your ad to appear?</h3>
        <p className="text-sm text-muted-foreground">
          Choose the section of the platform where your advertisement will be displayed
        </p>
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full max-w-xs">
          <SelectValue placeholder="Select a section" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="home">Home Page</SelectItem>
          <SelectItem value="marketplace">Marketplace</SelectItem>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="services">Services</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
