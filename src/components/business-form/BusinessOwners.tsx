import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { X, UserPlus } from "lucide-react";
import { OwnerFormFields } from "./owners/OwnerFormFields";
import { NewOwnerForm } from "./owners/NewOwnerForm";
import type { Owner } from "./types/owner";

interface BusinessOwnersProps {
  owners: Owner[];
  onChange: (owners: Owner[]) => void;
}

const TEST_OWNERS: Owner[] = [
  {
    name: "Jane Smith",
    role: "Primary Owner",
    position: "CEO",
    experience: "10 years",
    qualifications: "MBA, Business Administration",
    image_url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  },
  {
    name: "John Doe",
    role: "Co-Owner",
    position: "CTO",
    experience: "8 years",
    qualifications: "MS Computer Science",
    image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  }
];

export const BusinessOwners = ({ owners = [], onChange }: BusinessOwnersProps) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Add test data if owners array is empty
  if (owners.length === 0) {
    onChange(TEST_OWNERS);
  }

  const handleAddOwner = (newOwner: Owner) => {
    console.log("Adding new owner:", newOwner);
    onChange([...owners, newOwner]);
    setShowAddForm(false);
  };

  const handleRemoveOwner = (index: number) => {
    console.log("Removing owner at index:", index);
    onChange(owners.filter((_, i) => i !== index));
  };

  const handleUpdateOwner = (index: number, field: keyof Owner, value: string) => {
    console.log(`Updating owner at index ${index}, field: ${field}, value:`, value);
    const updatedOwners = [...owners];
    updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    onChange(updatedOwners);
  };

  const handleUpdateOwnerImage = (index: number, imageUrl: string | null) => {
    console.log("Updating owner image at index", index, "with URL:", imageUrl);
    const updatedOwners = [...owners];
    updatedOwners[index] = { ...updatedOwners[index], image_url: imageUrl };
    onChange(updatedOwners);
  };

  return (
    <div className="space-y-4">
      <Label>Owner Details</Label>
      
      {owners.map((owner, index) => (
        <Card key={index} className="p-6">
          <div className="flex justify-between items-start gap-4">
            <OwnerFormFields
              owner={owner}
              onUpdate={(field, value) => handleUpdateOwner(index, field, value)}
              onUpdateImage={(image) => handleUpdateOwnerImage(index, image)}
            />
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOwner(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}

      {!showAddForm ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAddForm(true)}
          className="w-full"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Another Owner
        </Button>
      ) : (
        <NewOwnerForm
          onAdd={handleAddOwner}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};