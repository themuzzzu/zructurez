import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, X, UserPlus } from "lucide-react";
import { ImageUpload } from "../ImageUpload";
import { Card } from "../ui/card";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOwner, setNewOwner] = useState<Owner>({
    name: "",
    role: "Primary Owner",
    position: "",
    experience: "",
    image_url: null,
  });

  const handleAddOwner = () => {
    if (newOwner.name && newOwner.role) {
      onChange([...owners, { ...newOwner }]);
      setNewOwner({
        name: "",
        role: "Primary Owner",
        position: "",
        experience: "",
        image_url: null,
      });
      setShowAddForm(false); // Hide form after adding
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
        <Card key={index} className="p-4 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="grid gap-4 flex-1">
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="Owner Name"
                  value={owner.name}
                  onChange={(e) => handleUpdateOwner(index, "name", e.target.value)}
                />
              </div>
              
              <div>
                <Label>Role</Label>
                <Input
                  placeholder="Role (e.g., Primary Owner, Co-Owner)"
                  value={owner.role}
                  onChange={(e) => handleUpdateOwner(index, "role", e.target.value)}
                />
              </div>
              
              <div>
                <Label>Position</Label>
                <Input
                  placeholder="Position (e.g., Principal, Chief Doctor)"
                  value={owner.position}
                  onChange={(e) => handleUpdateOwner(index, "position", e.target.value)}
                />
              </div>
              
              <div>
                <Label>Experience</Label>
                <Input
                  placeholder="Experience (e.g., 5 years)"
                  value={owner.experience}
                  onChange={(e) => handleUpdateOwner(index, "experience", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <ImageUpload
                  selectedImage={owner.image_url}
                  onImageSelect={(image) => handleUpdateOwnerImage(index, image)}
                  initialScale={1}
                  initialPosition={{ x: 50, y: 50 }}
                />
              </div>
            </div>
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
        <Card className="p-4 space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="New Owner Name"
                value={newOwner.name}
                onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Role</Label>
              <Input
                placeholder="Role"
                value={newOwner.role}
                onChange={(e) => setNewOwner({ ...newOwner, role: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Position</Label>
              <Input
                placeholder="Position"
                value={newOwner.position}
                onChange={(e) => setNewOwner({ ...newOwner, position: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Experience</Label>
              <Input
                placeholder="Experience (optional)"
                value={newOwner.experience}
                onChange={(e) => setNewOwner({ ...newOwner, experience: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <ImageUpload
                selectedImage={newOwner.image_url}
                onImageSelect={(image) => setNewOwner({ ...newOwner, image_url: image })}
                initialScale={1}
                initialPosition={{ x: 50, y: 50 }}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setNewOwner({
                    name: "",
                    role: "Primary Owner",
                    position: "",
                    experience: "",
                    image_url: null,
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddOwner}
                disabled={!newOwner.name || !newOwner.role}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Owner
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};