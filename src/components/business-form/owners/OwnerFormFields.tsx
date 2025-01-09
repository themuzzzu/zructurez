import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { ImageUpload } from "../../ImageUpload";
import type { Owner } from "../types/owner";

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
  return (
    <div className="grid gap-2 flex-1">
      <Input
        placeholder="Owner Name"
        value={name}
        onChange={(e) => onUpdate("name", e.target.value)}
      />
      <Input
        placeholder="Role (e.g., Primary Owner, Co-Owner)"
        value={role}
        onChange={(e) => onUpdate("role", e.target.value)}
      />
      <Input
        placeholder="Position (e.g., CEO, Medical Director)"
        value={position}
        onChange={(e) => onUpdate("position", e.target.value)}
      />
      <Input
        placeholder="Experience (optional)"
        value={experience}
        onChange={(e) => onUpdate("experience", e.target.value)}
      />
      <Input
        placeholder="Qualifications (optional)"
        value={qualifications}
        onChange={(e) => onUpdate("qualifications", e.target.value)}
      />
      <Textarea
        placeholder="Bio (optional)"
        value={bio}
        onChange={(e) => onUpdate("bio", e.target.value)}
        className="min-h-[100px]"
      />
      <div className="space-y-2">
        <ImageUpload
          selectedImage={image_url}
          onImageSelect={(image) => onUpdate("image_url", image)}
          initialScale={1}
          initialPosition={{ x: 50, y: 50 }}
        />
      </div>
    </div>
  );
};