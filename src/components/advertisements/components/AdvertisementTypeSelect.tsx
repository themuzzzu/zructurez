
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AdvertisementTypeSelectProps } from "../types";
import { AdType } from "@/services/adService";

export function AdvertisementTypeSelect({ value, onChange }: AdvertisementTypeSelectProps) {
  return (
    <div>
      <Label>Advertisement Type</Label>
      <Select 
        value={value} 
        onValueChange={(newValue: AdType) => onChange(newValue)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="service">Service</SelectItem>
          <SelectItem value="product">Product</SelectItem>
          <SelectItem value="sponsored">Sponsored</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
