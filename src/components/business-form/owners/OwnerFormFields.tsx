import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { ImageUpload } from "../../ImageUpload";
import type { Owner } from "../types/owner";
import { Label } from "../../ui/label";
import { toast } from "sonner";

interface OwnerFormFieldsProps {
  name: string;
  role: string;
  position: string;
  experience: string;
  qualifications?: string;
  bio?: string;
  image_url?: string | null;
  onUpdate: (field: keyof Owner, value: string) => void;
}

export const OwnerFormFields = ({
  name,
  role,
  position,
  experience,
  qualifications = "",
  bio = "",
  image_url,
  onUpdate,
}: OwnerFormFieldsProps) => {
  const handleImageSelect = async (image: string | null) => {
    console.log('Selected image:', image);
    if (image) {
      onUpdate("image_url", image);
      toast.success("Image uploaded successfully");
    }
  };

  return (
    <div className="grid gap-4 flex-1">
      <div className="space-y-2">
        <Label>Owner Name</Label>
        <Input
          placeholder="Owner Name"
          value={name}
          onChange={(e) => onUpdate("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <Input
          placeholder="Role (e.g., Primary Owner, Co-Owner)"
          value={role}
          onChange={(e) => onUpdate("role", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Position</Label>
        <Input
          placeholder="Position (e.g., CEO, Medical Director)"
          value={position}
          onChange={(e) => onUpdate("position", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Experience</Label>
        <Input
          placeholder="Experience (optional)"
          value={experience}
          onChange={(e) => onUpdate("experience", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Qualifications</Label>
        <Input
          placeholder="Qualifications (optional)"
          value={qualifications}
          onChange={(e) => onUpdate("qualifications", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea
          placeholder="Bio (optional)"
          value={bio}
          onChange={(e) => onUpdate("bio", e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Owner Photo</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Upload a professional photo of the owner. This will be displayed on the business profile.
        </p>
        <ImageUpload
          selectedImage={image_url}
          onImageSelect={handleImageSelect}
          initialScale={1}
          initialPosition={{ x: 50, y: 50 }}
          skipAutoSave={true}
        />
      </div>
    </div>
  );
};