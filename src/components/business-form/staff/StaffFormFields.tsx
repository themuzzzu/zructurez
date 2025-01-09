import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { ImageUpload } from "../../ImageUpload";
import type { StaffFormFieldsProps } from "../types/staff";

export const StaffFormFields = ({
  name,
  position,
  experience,
  bio = "",
  image_url,
  onUpdate,
}: StaffFormFieldsProps) => {
  return (
    <div className="grid gap-2 flex-1">
      <Input
        placeholder="Staff Name"
        value={name}
        onChange={(e) => onUpdate("name", e.target.value)}
      />
      <Input
        placeholder="Position"
        value={position}
        onChange={(e) => onUpdate("position", e.target.value)}
      />
      <Input
        placeholder="Experience (optional)"
        value={experience}
        onChange={(e) => onUpdate("experience", e.target.value)}
      />
      <Textarea
        placeholder="Bio (optional)"
        value={bio}
        onChange={(e) => onUpdate("bio", e.target.value)}
        className="min-h-[100px]"
      />
      <div className="space-y-2">
        <Label>Staff Photo</Label>
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