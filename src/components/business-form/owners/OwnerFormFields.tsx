import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { ImageUpload } from "../../ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Owner, OwnerFormProps } from "../types/owner";

export const OwnerFormFields = ({ owner, onUpdate, onUpdateImage }: OwnerFormProps) => {
  console.log("Rendering OwnerFormFields with owner:", owner);

  const handleImageSelect = async (image: string | null) => {
    if (!image) {
      console.log("No image selected");
      onUpdateImage?.(null);
      return;
    }

    try {
      // Convert base64 to blob
      const base64Data = image.split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
      
      // Upload to Supabase Storage
      const fileName = `${crypto.randomUUID()}.jpg`;
      const { data, error } = await supabase.storage
        .from('business-images')
        .upload(`owners/${fileName}`, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-images')
        .getPublicUrl(`owners/${fileName}`);

      console.log("Image uploaded successfully:", publicUrl);
      onUpdateImage?.(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error handling image:", error);
      toast.error("Failed to process image");
    }
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