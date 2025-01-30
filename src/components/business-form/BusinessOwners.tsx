import { useState } from "react";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "../ui/label";
import { OwnerFormFields } from "./owners/OwnerFormFields";
import { toast } from "sonner";
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
    qualifications: "Licensed Aesthetician, Certified Spa Director",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Sophie Chen",
    role: "Co-Owner",
    position: "Wellness Director",
    experience: "15 years",
    qualifications: "PhD in Holistic Medicine, Certified Yoga Instructor",
    image_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Amanda Thompson",
    role: "Partner",
    position: "Head of Therapeutic Services",
    experience: "12 years",
    qualifications: "Licensed Massage Therapist, Aromatherapy Specialist",
    image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
  }
];

export const BusinessOwners = ({ owners = [], onChange }: BusinessOwnersProps) => {
  const [newOwner, setNewOwner] = useState<Owner>({
    name: "",
    role: "",
    position: "",
    experience: "",
    qualifications: "",
    image_url: null,
  });

  // Add test data if owners array is empty
  if (owners.length === 0) {
    onChange(TEST_OWNERS);
  }

  const validateOwner = (owner: Owner) => {
    const requiredFields = {
      name: "Name",
      role: "Role",
      position: "Position"
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !owner[key as keyof Owner])
      .map(([_, label]) => label);

    return missingFields;
  };

  const handleAddOwner = () => {
    const missingFields = validateOwner(newOwner);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in the required fields: ${missingFields.join(", ")}`);
      return;
    }

    onChange([...owners, newOwner]);
    setNewOwner({
      name: "",
      role: "",
      position: "",
      experience: "",
      qualifications: "",
      image_url: null,
    });
    toast.success("Owner added successfully");
  };

  const handleRemoveOwner = (index: number) => {
    onChange(owners.filter((_, i) => i !== index));
    toast.success("Owner removed successfully");
  };

  const handleUpdateOwner = (index: number, field: keyof Owner, value: string) => {
    const updatedOwners = [...owners];
    updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    onChange(updatedOwners);
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Business Owners</Label>

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
        <div className="p-4 border rounded-lg bg-muted/50">
          <OwnerFormFields
            {...newOwner}
            onUpdate={(field, value) => 
              setNewOwner({ ...newOwner, [field]: value })
            }
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddOwner}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Owner
        </Button>
      </div>
    </div>
  );
};