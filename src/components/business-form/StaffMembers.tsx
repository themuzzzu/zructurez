import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { ImageUpload } from "../ImageUpload";

interface StaffMember {
  name: string;
  position: string;
  experience: string;
  image_url?: string | null;
}

interface StaffMembersProps {
  staff: StaffMember[];
  onChange: (staff: StaffMember[]) => void;
}

const TEST_STAFF = [
  {
    name: "Dr. Sarah Johnson",
    position: "Medical Director",
    experience: "15 years",
    image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. Emily Chen",
    position: "Chief Medical Officer",
    experience: "12 years",
    image_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80"
  },
  {
    name: "Michael Chen",
    position: "Senior Massage Therapist",
    experience: "10 years",
    image_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80"
  },
  {
    name: "Emma Rodriguez",
    position: "Nutritionist",
    experience: "5 years",
    image_url: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80"
  },
  {
    name: "Sarah Thompson",
    position: "Physical Therapist",
    experience: "8 years",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"
  }
];

export const StaffMembers = ({ staff = [], onChange }: StaffMembersProps) => {
  const [newStaff, setNewStaff] = useState<StaffMember>({
    name: "",
    position: "",
    experience: "",
    image_url: null,
  });
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  // Add test data if staff array is empty
  if (staff.length === 0) {
    onChange(TEST_STAFF);
  }

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.position) {
      onChange([...staff, { ...newStaff, image_url: pendingImage }]);
      setNewStaff({ name: "", position: "", experience: "", image_url: null });
      setPendingImage(null);
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

  const handleUpdateStaffImage = (index: number, imageUrl: string | null) => {
    const updatedStaff = [...staff];
    updatedStaff[index] = { ...updatedStaff[index], image_url: imageUrl };
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
              <div className="space-y-2">
                <Label>Profile Picture (optional)</Label>
                <ImageUpload
                  selectedImage={member.image_url}
                  onImageSelect={(image) => handleUpdateStaffImage(index, image)}
                  initialScale={1}
                  initialPosition={{ x: 50, y: 50 }}
                />
              </div>
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
        <div className="space-y-2">
          <Label>Profile Picture (optional)</Label>
          <ImageUpload
            selectedImage={pendingImage}
            onImageSelect={setPendingImage}
            initialScale={1}
            initialPosition={{ x: 50, y: 50 }}
          />
        </div>
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
