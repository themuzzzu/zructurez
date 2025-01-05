import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface BusinessProfileInfoProps {
  formData: {
    bio: string;
    website: string;
    owner_profession?: string;
    owner_qualification?: string;
    staff_details?: { name: string; role: string }[];
  };
  onChange: (name: string, value: any) => void;
}

export const BusinessProfileInfo = ({ formData, onChange }: BusinessProfileInfoProps) => {
  const [newStaffMember, setNewStaffMember] = useState({ name: "", role: "" });

  const handleAddStaffMember = () => {
    if (newStaffMember.name && newStaffMember.role) {
      const currentStaff = formData.staff_details || [];
      onChange("staff_details", [...currentStaff, newStaffMember]);
      setNewStaffMember({ name: "", role: "" });
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

      <div className="space-y-2">
        <Label htmlFor="owner_profession">Owner's Profession (Optional)</Label>
        <Input
          id="owner_profession"
          value={formData.owner_profession || ""}
          onChange={(e) => onChange("owner_profession", e.target.value)}
          placeholder="e.g., Doctor, Chef, Instructor"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="owner_qualification">Owner's Qualification (Optional)</Label>
        <Input
          id="owner_qualification"
          value={formData.owner_qualification || ""}
          onChange={(e) => onChange("owner_qualification", e.target.value)}
          placeholder="e.g., MD, MBA, PhD"
        />
      </div>

      <div className="space-y-4">
        <Label>Staff Details (Optional)</Label>
        
        {(formData.staff_details || []).map((staff, index) => (
          <div key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <div className="flex-1">
              <p className="text-sm font-medium">{staff.name}</p>
              <p className="text-sm text-muted-foreground">{staff.role}</p>
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
        ))}

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Staff Name"
              value={newStaffMember.name}
              onChange={(e) => setNewStaffMember(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Role"
              value={newStaffMember.role}
              onChange={(e) => setNewStaffMember(prev => ({ ...prev, role: e.target.value }))}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddStaffMember}
              disabled={!newStaffMember.name || !newStaffMember.role}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};