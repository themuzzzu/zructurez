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

export const BusinessOwners = ({ owners = [], onChange }: BusinessOwnersProps) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddOwner = (newOwner: Owner) => {
    onChange([...owners, newOwner]);
    setShowAddForm(false);
  };

  const handleRemoveOwner = (index: number) => {
    onChange(owners.filter((_, i) => i !== index));
  };

  const handleUpdateOwner = (index: number, field: keyof Owner, value: string) => {
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