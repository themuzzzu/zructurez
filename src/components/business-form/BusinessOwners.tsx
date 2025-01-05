import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { ImageUpload } from "../ImageUpload";

interface Owner {
  name: string;
  role: string;
  position: string;
  experience: string;
  image_url?: string | null;
}

interface BusinessOwnersProps {
  owners: Owner[];
  onChange: (owners: Owner[]) => void;
}

export const BusinessOwners = ({ owners = [], onChange }: BusinessOwnersProps) => {
  const [newOwner, setNewOwner] = useState<Owner>({
    name: "",
    role: "",
    position: "",
    experience: "",
    image_url: null,
  });

  const handleAddOwner = () => {
    if (newOwner.name && newOwner.role) {
      onChange([...owners, { ...newOwner }]);
      setNewOwner({ name: "", role: "", position: "", experience: "", image_url: null });
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

  const handleUpdateOwnerImage = (index: number, imageUrl: string | null) => {
    const updatedOwners = [...owners];
    updatedOwners[index] = { ...updatedOwners[index], image_url: imageUrl };
    onChange(updatedOwners);
  };

  return (
    <div className="space-y-4">
      <Label>Business Owners</Label>
      
      {owners.map((owner, index) => (
        <div key={index} className="grid gap-2 p-4 border rounded-lg bg-muted/50">
          <div className="flex justify-between items-start">
            <div className="grid gap-2 flex-1">
              <Input
                placeholder="Owner Name"
                value={owner.name}
                onChange={(e) => handleUpdateOwner(index, "name", e.target.value)}
              />
              <Input
                placeholder="Role (e.g., Primary Owner, Co-Owner)"
                value={owner.role}
                onChange={(e) => handleUpdateOwner(index, "role", e.target.value)}
              />
              <Input
                placeholder="Position (e.g., Principal, Chief Doctor)"
                value={owner.position}
                onChange={(e) => handleUpdateOwner(index, "position", e.target.value)}
              />
              <Input
                placeholder="Experience (optional)"
                value={owner.experience}
                onChange={(e) => handleUpdateOwner(index, "experience", e.target.value)}
              />
              <div className="space-y-2">
                <Label>Profile Picture (optional)</Label>
                <ImageUpload
                  selectedImage={owner.image_url}
                  onImageSelect={(image) => handleUpdateOwnerImage(index, image)}
                  initialScale={1}
                  initialPosition={{ x: 50, y: 50 }}
                />
              </div>
            </div>
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
        <Input
          placeholder="New Owner Name"
          value={newOwner.name}
          onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
        />
        <Input
          placeholder="Role"
          value={newOwner.role}
          onChange={(e) => setNewOwner({ ...newOwner, role: e.target.value })}
        />
        <Input
          placeholder="Position"
          value={newOwner.position}
          onChange={(e) => setNewOwner({ ...newOwner, position: e.target.value })}
        />
        <Input
          placeholder="Experience (optional)"
          value={newOwner.experience}
          onChange={(e) => setNewOwner({ ...newOwner, experience: e.target.value })}
        />
        <div className="space-y-2">
          <Label>Profile Picture (optional)</Label>
          <ImageUpload
            selectedImage={newOwner.image_url}
            onImageSelect={(image) => setNewOwner({ ...newOwner, image_url: image })}
            initialScale={1}
            initialPosition={{ x: 50, y: 50 }}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddOwner}
          disabled={!newOwner.name || !newOwner.role}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Owner
        </Button>
      </div>
    </div>
  );
};