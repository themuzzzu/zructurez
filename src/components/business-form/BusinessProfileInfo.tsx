
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { BusinessFormData } from "./types";
import { BusinessOwners } from "./BusinessOwners";
import { StaffMembers } from "./StaffMembers";

interface BusinessProfileInfoProps {
  formData: BusinessFormData;
  onChange: (name: string, value: any) => void;
}

export const BusinessProfileInfo = ({ formData, onChange }: BusinessProfileInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="Tell us about your business"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={formData.website}
          onChange={(e) => onChange("website", e.target.value)}
          placeholder="https://example.com"
          type="url"
        />
      </div>

      <BusinessOwners
        owners={formData.owners}
        onChange={(owners) => onChange("owners", owners)}
      />

      <StaffMembers
        staff={formData.staff_details}
        onChange={(staff) => onChange("staff_details", staff)}
      />
    </>
  );
};
