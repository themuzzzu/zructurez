import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MapLocationSelector } from "../create-service/MapLocationSelector";
import { BusinessHoursSelect } from "./BusinessHoursSelect";

interface BusinessContactInfoProps {
  formData: {
    location: string;
    contact: string;
    hours: string;
  };
  onChange: (name: string, value: string) => void;
}

export const BusinessContactInfo = ({ formData, onChange }: BusinessContactInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Location</Label>
        <MapLocationSelector
          value={formData.location}
          onChange={(location) => onChange("location", location)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">Contact Information</Label>
        <Input
          id="contact"
          value={formData.contact}
          onChange={(e) => onChange("contact", e.target.value)}
          placeholder="Phone number or email"
        />
      </div>

      <BusinessHoursSelect
        value={formData.hours}
        onChange={(value) => onChange("hours", value)}
      />
    </>
  );
};