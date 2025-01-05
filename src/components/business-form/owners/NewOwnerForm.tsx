import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Plus } from "lucide-react";
import { OwnerFormFields } from "./OwnerFormFields";
import type { Owner, NewOwnerFormProps } from "../types/owner";

export const NewOwnerForm = ({ onAdd, onCancel }: NewOwnerFormProps) => {
  const [newOwner, setNewOwner] = useState<Owner>({
    name: "",
    role: "Primary Owner",
    position: "",
    experience: "",
    qualifications: "",
    image_url: null,
  });

  const handleUpdate = (field: keyof Owner, value: string) => {
    setNewOwner({ ...newOwner, [field]: value });
  };

  const handleUpdateImage = (imageUrl: string | null) => {
    setNewOwner({ ...newOwner, image_url: imageUrl });
  };

  return (
    <Card className="p-4 space-y-4">
      <OwnerFormFields
        owner={newOwner}
        onUpdate={handleUpdate}
        onUpdateImage={handleUpdateImage}
      />

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (newOwner.name && newOwner.role) {
              onAdd(newOwner);
            }
          }}
          disabled={!newOwner.name || !newOwner.role}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Owner
        </Button>
      </div>
    </Card>
  );
};