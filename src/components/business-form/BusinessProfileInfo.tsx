import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { BusinessOwners } from "./BusinessOwners";

interface BusinessProfileInfoProps {
  formData: {
    bio: string;
    website: string;
    owners: { name: string; role: string; position: string; experience: string; }[];
    staff_details: { name: string; position: string; experience: string; }[];
  };
  onChange: (name: string, value: any) => void;
}

export const BusinessProfileInfo = ({ formData, onChange }: BusinessProfileInfoProps) => {
  const [newStaffMember, setNewStaffMember] = useState({ 
    name: "", 
    position: "", 
    experience: "" 
  });

  const handleAddStaffMember = () => {
    if (newStaffMember.name) {
      const currentStaff = formData.staff_details || [];
      onChange("staff_details", [...currentStaff, newStaffMember]);
      setNewStaffMember({ name: "", position: "", experience: "" });
    }
  };

  const handleRemoveStaffMember = (index: number) => {
    const currentStaff = formData.staff_details || [];
    onChange("staff_details", currentStaff.filter((_, i) => i !== index));
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
        owners={formData.owners || []}
        onChange={(owners) => onChange("owners", owners)}
      />

      <div className="space-y-4">
        <Label>Staff Details (Optional)</Label>
        
        {(formData.staff_details || []).map((staff, index) => (
          <div key={index} className="grid gap-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex justify-between items-start">
              <div className="grid gap-2 flex-1">
                <Input
                  placeholder="Staff Name"
                  value={staff.name}
                  onChange={(e) => {
                    const updatedStaff = [...formData.staff_details];
                    updatedStaff[index] = { ...staff, name: e.target.value };
                    onChange("staff_details", updatedStaff);
                  }}
                />
                <Input
                  placeholder="Position (e.g., HOD, Senior Doctor)"
                  value={staff.position}
                  onChange={(e) => {
                    const updatedStaff = [...formData.staff_details];
                    updatedStaff[index] = { ...staff, position: e.target.value };
                    onChange("staff_details", updatedStaff);
                  }}
                />
                <Input
                  placeholder="Experience (optional)"
                  value={staff.experience}
                  onChange={(e) => {
                    const updatedStaff = [...formData.staff_details];
                    updatedStaff[index] = { ...staff, experience: e.target.value };
                    onChange("staff_details", updatedStaff);
                  }}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveStaffMember(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="grid gap-2">
          <Input
            placeholder="Staff Name"
            value={newStaffMember.name}
            onChange={(e) => setNewStaffMember(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="Position"
            value={newStaffMember.position}
            onChange={(e) => setNewStaffMember(prev => ({ ...prev, position: e.target.value }))}
          />
          <Input
            placeholder="Experience"
            value={newStaffMember.experience}
            onChange={(e) => setNewStaffMember(prev => ({ ...prev, experience: e.target.value }))}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddStaffMember}
            disabled={!newStaffMember.name}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>
      </div>
    </>
  );
};