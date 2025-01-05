import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { ImageUpload } from "../../ImageUpload";
import type { Owner, OwnerFormProps } from "../types/owner";

export const OwnerFormFields = ({ owner, onUpdate, onUpdateImage }: OwnerFormProps) => {
  console.log("Rendering OwnerFormFields with owner:", owner);

  const handleImageSelect = (image: string | null) => {
    console.log("Image selected in OwnerFormFields:", image);
    onUpdateImage?.(image);
  };

  return (
    <div className="grid gap-4 flex-1">
      <div>
        <Label>Name</Label>
        <Input
          placeholder="Owner Name"
          value={owner.name}
          onChange={(e) => onUpdate("name", e.target.value)}
        />
      </div>
      
      <div>
        <Label>Role</Label>
        <Input
          placeholder="Role (e.g., Primary Owner, Co-Owner)"
          value={owner.role}
          onChange={(e) => onUpdate("role", e.target.value)}
        />
      </div>
      
      <div>
        <Label>Position</Label>
        <Input
          placeholder="Position (e.g., Principal, Chief Doctor)"
          value={owner.position}
          onChange={(e) => onUpdate("position", e.target.value)}
        />
      </div>
      
      <div>
        <Label>Experience</Label>
        <Input
          placeholder="Experience (e.g., 5 years)"
          value={owner.experience}
          onChange={(e) => onUpdate("experience", e.target.value)}
        />
      </div>

      <div>
        <Label>Qualifications</Label>
        <Input
          placeholder="Qualifications (e.g., MBA, PhD)"
          value={owner.qualifications || ""}
          onChange={(e) => onUpdate("qualifications", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <ImageUpload
          selectedImage={owner.image_url}
          onImageSelect={handleImageSelect}
          initialScale={1}
          initialPosition={{ x: 50, y: 50 }}
        />
      </div>
    </div>
  );
};