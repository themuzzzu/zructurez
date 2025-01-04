import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface BusinessProfileInfoProps {
  formData: {
    bio: string;
    website: string;
  };
  onChange: (name: string, value: string) => void;
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
    </>
  );
};