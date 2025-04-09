
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { UploadButtonsProps } from "./types";

export const UploadButtons = ({ 
  onFileSelect, 
  onCameraCapture,
  buttonText = "Upload Image"
}: UploadButtonsProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        variant="secondary"
        className="flex-1 flex items-center gap-2" 
        onClick={() => document.getElementById("image-upload")?.click()}
      >
        <Upload className="h-4 w-4" />
        {buttonText}
      </Button>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        className="flex-1 flex items-center gap-2"
        onClick={onCameraCapture}
      >
        <Camera className="h-4 w-4" />
        Use Camera
      </Button>
    </div>
  );
};
