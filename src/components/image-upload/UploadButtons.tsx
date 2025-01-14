import { Camera, Upload } from "lucide-react";
import { Button } from "../ui/button";

interface UploadButtonsProps {
  onCameraCapture: () => void;
  onFileSelect: (file: File) => void;
}

export const UploadButtons = ({ onCameraCapture, onFileSelect }: UploadButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) onFileSelect(file);
          };
          input.click();
        }}
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={onCameraCapture}
      >
        <Camera className="mr-2 h-4 w-4" />
        Camera
      </Button>
    </div>
  );
};