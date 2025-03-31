import { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { StaffFormFields } from "./staff/StaffFormFields";
import { StaffMemberCard } from "./staff/StaffMemberCard";
import type { StaffMember, StaffMembersProps } from "./types/staff";

const TEST_STAFF = [
  {
    name: "Sarah Williams",
    position: "Senior Massage Therapist",
    experience: "10 years",
    bio: "Specializing in deep tissue and sports massage therapy with a focus on injury recovery.",
    image_url: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400"
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
    image_url: null,
  });

  // Add test data if staff array is empty
  if (staff.length === 0) {
    onChange(TEST_STAFF);
  }

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.position) {
      onChange([...staff, newStaff]);
      setNewStaff({
        name: "",
        position: "",
        experience: "",
        bio: "",
        image_url: null,
      });
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
        <StaffMemberCard
          key={index}
          member={member}
          onUpdate={(field, value) => handleUpdateStaff(index, field, value)}
          onRemove={() => handleRemoveStaff(index)}
        />
      ))}

      <div className="grid gap-2">
        <StaffFormFields
          {...newStaff}
          position={newStaff.position || ""}
          onUpdate={(field, value) => 
            setNewStaff({ ...newStaff, [field]: value })
          }
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
