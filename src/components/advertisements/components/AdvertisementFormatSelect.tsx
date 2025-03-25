
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AdvertisementFormatSelectProps } from "../types";
import { AdFormat } from "@/services/adService";

export function AdvertisementFormatSelect({ value, onChange }: AdvertisementFormatSelectProps) {
  return (
    <div>
      <Label>Advertisement Format</Label>
      <Select 
        value={value} 
        onValueChange={(newValue: AdFormat) => onChange(newValue)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="banner">Banner</SelectItem>
          <SelectItem value="carousel">Carousel</SelectItem>
          <SelectItem value="video">Video</SelectItem>
          <SelectItem value="boosted_post">Boosted Post</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
