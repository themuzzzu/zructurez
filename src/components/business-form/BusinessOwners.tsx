import { useState } from "react";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ImageUpload } from "../ImageUpload";
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
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [pendingOwnerIndex, setPendingOwnerIndex] = useState<number | null>(null);

  // Add test data if owners array is empty
  if (owners.length === 0) {
    onChange(TEST_OWNERS);
  }

  const handleAddOwner = () => {
    if (newOwner.name && newOwner.role && newOwner.position) {
      onChange([...owners, { ...newOwner, image_url: pendingImage }]);
      setNewOwner({
        name: "",
        role: "",
        position: "",
        experience: "",
        qualifications: "",
        image_url: null,
      });
      setPendingImage(null);
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
    setPendingOwnerIndex(index);
    setPendingImage(imageUrl);
  };

  const handleSaveImage = (index: number) => {
    if (pendingImage && pendingOwnerIndex === index) {
      const updatedOwners = [...owners];
      updatedOwners[index] = { ...updatedOwners[index], image_url: pendingImage };
      onChange(updatedOwners);
      setPendingImage(null);
      setPendingOwnerIndex(null);
    }
  };

  const handleCancelImage = () => {
    setPendingImage(null);
    setPendingOwnerIndex(null);
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
                placeholder="Position (e.g., CEO, Medical Director)"
                value={owner.position}
                onChange={(e) => handleUpdateOwner(index, "position", e.target.value)}
              />
              <Input
                placeholder="Experience (optional)"
                value={owner.experience}
                onChange={(e) => handleUpdateOwner(index, "experience", e.target.value)}
              />
              <Input
                placeholder="Qualifications (optional)"
                value={owner.qualifications}
                onChange={(e) => handleUpdateOwner(index, "qualifications", e.target.value)}
              />
              <div className="space-y-2">
                <Label>Profile Picture (optional)</Label>
                <ImageUpload
                  selectedImage={pendingOwnerIndex === index ? pendingImage : owner.image_url}
                  onImageSelect={(image) => handleUpdateOwnerImage(index, image)}
                  initialScale={1}
                  initialPosition={{ x: 50, y: 50 }}
                />
                {pendingOwnerIndex === index && pendingImage && (
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" onClick={handleCancelImage}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSaveImage(index)}>
                      Save Image
                    </Button>
                  </div>
                )}
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
        <Input
          placeholder="Qualifications (optional)"
          value={newOwner.qualifications}
          onChange={(e) => setNewOwner({ ...newOwner, qualifications: e.target.value })}
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