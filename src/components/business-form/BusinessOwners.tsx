import { useState } from "react";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "../ui/label";
import { OwnerFormFields } from "./owners/OwnerFormFields";
import type { Owner } from "./types/owner";

interface BusinessOwnersProps {
  owners: Owner[];
  onChange: (owners: Owner[]) => void;
}

const TEST_OWNERS = [
  {
    name: "Isabella Martinez",
    role: "Founder & CEO",
    position: "Master Aesthetician",
    experience: "18 years",
    qualifications: "Licensed Aesthetician, Certified Spa Director"
  },
  {
    name: "Sophie Chen",
    role: "Co-Owner",
    position: "Wellness Director",
    experience: "15 years",
    qualifications: "PhD in Holistic Medicine, Certified Yoga Instructor"
  },
  {
    name: "Amanda Thompson",
    role: "Partner",
    position: "Head of Therapeutic Services",
    experience: "12 years",
    qualifications: "Licensed Massage Therapist, Aromatherapy Specialist"
  }
];

export const BusinessOwners = ({ owners = [], onChange }: BusinessOwnersProps) => {
  const [newOwner, setNewOwner] = useState<Owner>({
    name: "",
    role: "",
    position: "",
    experience: "",
    qualifications: "",
  });

  // Add test data if owners array is empty
  if (owners.length === 0) {
    onChange(TEST_OWNERS);
  }

  const handleAddOwner = () => {
    if (newOwner.name && newOwner.role && newOwner.position) {
      onChange([...owners, newOwner]);
      setNewOwner({
        name: "",
        role: "",
        position: "",
        experience: "",
        qualifications: "",
      });
    }
  };

  const handleRemoveOwner = (index: number) => {
    onChange(owners.filter((_, i) => i !== index));
  };

  const handleUpdateOwner = (index: number, field: keyof Owner, value: string) => {
    const updatedOwners = [...owners];
    updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    onChange(updatedOwners);
  };

  return (
    <div className="space-y-4">
      <Label>Business Owners</Label>

      {owners.map((owner, index) => (
        <div key={index} className="grid gap-2 p-4 border rounded-lg bg-muted/50">
          <div className="flex justify-between items-start">
            <OwnerFormFields
              {...owner}
              onUpdate={(field, value) => handleUpdateOwner(index, field as keyof Owner, value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveOwner(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <div className="grid gap-2">
        <OwnerFormFields
          {...newOwner}
          onUpdate={(field, value) => 
            setNewOwner({ ...newOwner, [field]: value })
          }
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddOwner}
          disabled={!newOwner.name || !newOwner.role || !newOwner.position}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Owner
        </Button>
      </div>
    </div>
  );
};