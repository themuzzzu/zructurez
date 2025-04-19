
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

export const SelectType = ({ section, value, onChange }: SelectTypeProps) => {
  // Define the ad types available for each section
  const adTypesBySection: Record<AdSectionType, { value: AdType; label: string }[]> = {
    home: [
      { value: "banner", label: "Banner Ad" },
      { value: "flash_deal", label: "Flash Deal" },
    ],
    marketplace: [
      { value: "banner", label: "Banner Ad" },
      { value: "sponsored_product", label: "Sponsored Product" },
      { value: "suggested_product", label: "Suggested Product" },
    ],
    business: [
      { value: "banner", label: "Banner Ad" },
      { value: "sponsored_business", label: "Sponsored Business" },
      { value: "suggested_business", label: "Suggested Business" },
    ],
    services: [
      { value: "banner", label: "Banner Ad" },
      { value: "recommended_service", label: "Recommended Service" },
      { value: "sponsored_service", label: "Sponsored Service" },
    ],
  };

  // Get the available ad types based on the selected section
  const availableTypes = section ? adTypesBySection[section] : [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Select Advertisement Type</h3>
        <p className="text-sm text-muted-foreground">
          Choose the type of advertisement you want to create
        </p>
      </div>

      {!section ? (
        <div className="text-amber-500 text-sm p-3 bg-amber-50 rounded-md border border-amber-200">
          Please select a section first to see available ad types
        </div>
      ) : (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select an ad type" />
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
