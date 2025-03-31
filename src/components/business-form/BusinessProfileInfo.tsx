
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { BusinessFormData } from "./types/form";
import { BusinessOwners } from "./BusinessOwners";
import { StaffMembers } from "./StaffMembers";
import { Owner } from "./types/owner";
import { StaffMember } from "./types/staff";

interface BusinessProfileInfoProps {
  formData: BusinessFormData;
  onChange: (name: string, value: any) => void;
}

export const BusinessProfileInfo = ({ formData, onChange }: BusinessProfileInfoProps) => {
  // Helper function to convert BusinessOwner[] to Owner[]
  const convertOwners = (owners: any[]): Owner[] => {
    return owners.map(owner => ({
      name: owner.name || "",
      role: owner.role || "",
      position: owner.position || "",
      experience: owner.experience || "",
      qualifications: owner.qualifications || "",
      bio: owner.bio || "",
      image_url: owner.image_url || null
    }));
  };

  // Helper function to convert StaffMember[] to the correct type
  const convertStaff = (staff: any[]): StaffMember[] => {
    return staff.map(member => ({
      name: member.name || "",
      position: member.position || "",
      experience: member.experience || "",
      bio: member.bio || "",
      image_url: member.image_url || null
    }));
  };

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
        owners={convertOwners(formData.owners)}
        onChange={(owners) => onChange("owners", owners)}
      />

      <StaffMembers
        staff={convertStaff(formData.staff_details)}
        onChange={(staff) => onChange("staff_details", staff)}
      />
    </>
  );
};
