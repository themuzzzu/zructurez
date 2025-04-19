
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdSectionType, AdType } from "../types";

interface SelectTypeProps {
  section?: AdSectionType;
  value?: AdType;
  onChange: (value: AdType) => void;
}

const adTypesBySection: Record<AdSectionType, { value: AdType; label: string }[]> = {
  home: [
    { value: "banner", label: "Banner Ad" },
    { value: "flash_deal", label: "Flash Deal" }
  ],
  marketplace: [
    { value: "banner", label: "Banner" },
    { value: "sponsored_product", label: "Sponsored Product" },
    { value: "suggested_product", label: "Suggested Product" }
  ],
  business: [
    { value: "banner", label: "Banner" },
    { value: "sponsored_business", label: "Sponsored Business" },
    { value: "suggested_business", label: "Suggested for You" }
  ],
  services: [
    { value: "banner", label: "Banner" },
    { value: "recommended_service", label: "Recommended Service" },
    { value: "sponsored_service", label: "Sponsored Service" }
  ]
};

export const SelectType = ({ section, value, onChange }: SelectTypeProps) => {
  const availableTypes = section ? adTypesBySection[section] : [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">What type of ad would you like to create?</h3>
        <p className="text-sm text-muted-foreground">
          Select the type of advertisement that best suits your needs
        </p>
      </div>

      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={!section}
      >
        <SelectTrigger className="w-full max-w-xs">
          <SelectValue placeholder={section ? "Select ad type" : "First select a section"} />
        </SelectTrigger>
        <SelectContent>
          {availableTypes.map(type => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
