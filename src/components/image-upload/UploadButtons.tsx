import { Button } from "../ui/button";
import { ImagePlus, Camera } from "lucide-react";

interface UploadButtonsProps {
  onCameraCapture: () => void;
  onFileSelect: (file: File) => void;
}

export const UploadButtons = ({ onCameraCapture, onFileSelect }: UploadButtonsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => document.getElementById('photo-upload')?.click()}
      >
        <ImagePlus className="h-4 w-4" />
        Choose Image
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2"
        onClick={onCameraCapture}
      >
        <Camera className="h-4 w-4" />
        Take Photo
      </Button>
      <input
        id="photo-upload"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileSelect(file);
          }
        }}
        className="hidden"
      />
    </div>
  );
};