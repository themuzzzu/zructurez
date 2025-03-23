
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdFormat } from "@/services/adService";

interface AdvertisementFormatSelectProps {
  value: AdFormat;
  onChange: (value: AdFormat) => void;
}

export const AdvertisementFormatSelect = ({ value, onChange }: AdvertisementFormatSelectProps) => {
  return (
    <div>
      <Label>Ad Format</Label>
      <Select value={value} onValueChange={(value: AdFormat) => onChange(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">Standard Ad</SelectItem>
          <SelectItem value="banner">Banner Ad</SelectItem>
          <SelectItem value="carousel">Carousel Ad</SelectItem>
          <SelectItem value="video">Video Ad</SelectItem>
          <SelectItem value="boosted_post">Boost Existing Post</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
