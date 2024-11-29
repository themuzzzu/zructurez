import { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (image: string | null) => void;
}

export const ImageUpload = ({ selectedImage, onImageSelect }: ImageUploadProps) => {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect(e.target?.result as string);
      toast.success("Photo uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onImageSelect(null);
    toast.info("Photo removed");
  };

  return (
    <>
      {selectedImage && (
        <div className="relative mt-4 group">
          <img
            src={selectedImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};