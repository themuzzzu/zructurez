
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { ImageUpload } from "../../image-upload/ImageUpload";
import { toast } from "sonner";
import type { StaffMember } from "../types/staff";

interface StaffFormFieldsProps {
  name: string;
  position: string;
  experience: string;
  bio?: string;
  image_url?: string | null;
  onUpdate: (field: keyof StaffMember, value: string) => void;
}

export const StaffFormFields = ({
  name,
  position,
  experience,
  bio = "",
  image_url,
  onUpdate,
}: StaffFormFieldsProps) => {
  const handleImageSelect = async (image: string | null) => {
    console.log('Selected staff image:', image);
    if (image) {
      onUpdate("image_url", image);
      toast.success("Staff image uploaded successfully!");
    }
  };

  return (
    <div className="grid gap-4 flex-1">
      <div className="space-y-2">
        <Label>Staff Name</Label>
        <Input
          placeholder="Staff Name"
          value={name}
          onChange={(e) => onUpdate("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Position</Label>
        <Input
          placeholder="Position"
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
        <Label>Bio</Label>
        <Textarea
          placeholder="Bio (optional)"
          value={bio}
          onChange={(e) => onUpdate("bio", e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Staff Photo</Label>
        <ImageUpload
          selectedImage={image_url}
          onImageSelect={handleImageSelect}
          skipAutoSave={true}
        />
      </div>
    </div>
  );
};
