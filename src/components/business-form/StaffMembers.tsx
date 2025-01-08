import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";

interface StaffMember {
  name: string;
  position: string;
  experience: string;
  bio?: string;
}

interface StaffMembersProps {
  staff: StaffMember[];
  onChange: (staff: StaffMember[]) => void;
}

const TEST_STAFF = [
  {
    name: "Sarah Williams",
    position: "Senior Massage Therapist",
    experience: "10 years",
    bio: "Specializing in deep tissue and sports massage therapy with a focus on injury recovery."
  },
  {
    name: "Emily Davis",
    position: "Skincare Specialist",
    experience: "8 years",
    bio: "Expert in advanced facial treatments and chemical peels."
  },
  {
    name: "Maria Rodriguez",
    position: "Yoga Instructor",
    experience: "6 years",
    bio: "Certified in Vinyasa and Yin yoga, focusing on mindfulness and alignment."
  },
  {
    name: "Jessica Kim",
    position: "Nail Artist",
    experience: "7 years",
    bio: "Specialized in intricate nail art and gel applications."
  },
  {
    name: "David Chen",
    position: "Acupuncturist",
    experience: "12 years",
    bio: "Licensed acupuncturist with expertise in traditional Chinese medicine."
  }
];

export const StaffMembers = ({ staff = [], onChange }: StaffMembersProps) => {
  const [newStaff, setNewStaff] = useState<StaffMember>({
    name: "",
    position: "",
    experience: "",
    bio: "",
  });

  // Add test data if staff array is empty
  if (staff.length === 0) {
    onChange(TEST_STAFF);
  }

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.position) {
      onChange([...staff, newStaff]);
      setNewStaff({ name: "", position: "", experience: "", bio: "" });
    }
  };

  const handleRemoveStaff = (index: number) => {
    onChange(staff.filter((_, i) => i !== index));
  };

  const handleUpdateStaff = (index: number, field: keyof StaffMember, value: string) => {
    const updatedStaff = [...staff];
    updatedStaff[index] = { ...updatedStaff[index], [field]: value };
    onChange(updatedStaff);
  };

  return (
    <div className="space-y-4">
      <Label>Staff Members (Optional)</Label>
      
      {staff.map((member, index) => (
        <div key={index} className="grid gap-2 p-4 border rounded-lg bg-muted/50">
          <div className="flex justify-between items-start">
            <div className="grid gap-2 flex-1">
              <Input
                placeholder="Staff Name"
                value={member.name}
                onChange={(e) => handleUpdateStaff(index, "name", e.target.value)}
              />
              <Input
                placeholder="Position"
                value={member.position}
                onChange={(e) => handleUpdateStaff(index, "position", e.target.value)}
              />
              <Input
                placeholder="Experience (optional)"
                value={member.experience}
                onChange={(e) => handleUpdateStaff(index, "experience", e.target.value)}
              />
              <Textarea
                placeholder="Bio (optional)"
                value={member.bio}
                onChange={(e) => handleUpdateStaff(index, "bio", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveStaff(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <div className="grid gap-2">
        <Input
          placeholder="New Staff Name"
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
        />
        <Input
          placeholder="Position"
          value={newStaff.position}
          onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
        />
        <Input
          placeholder="Experience (optional)"
          value={newStaff.experience}
          onChange={(e) => setNewStaff({ ...newStaff, experience: e.target.value })}
        />
        <Textarea
          placeholder="Bio (optional)"
          value={newStaff.bio}
          onChange={(e) => setNewStaff({ ...newStaff, bio: e.target.value })}
          className="min-h-[100px]"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddStaff}
          disabled={!newStaff.name || !newStaff.position}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>
    </div>
  );
};