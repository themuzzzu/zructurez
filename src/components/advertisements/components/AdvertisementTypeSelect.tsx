
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdType } from "@/services/adService";

interface AdvertisementTypeSelectProps {
  value: AdType;
  onChange: (value: AdType) => void;
}

export const AdvertisementTypeSelect = ({ value, onChange }: AdvertisementTypeSelectProps) => {
  return (
    <div>
      <Label>Advertisement Type</Label>
      <Select value={value} onValueChange={(value: AdType) => onChange(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="service">Service</SelectItem>
          <SelectItem value="product">Product</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
