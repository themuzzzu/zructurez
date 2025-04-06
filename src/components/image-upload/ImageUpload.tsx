
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (image: string | null) => void;
  label?: string;
  accept?: string;
  buttonText?: React.ReactNode;
}

export const ImageUpload = ({ 
  selectedImage, 
  onImageSelect, 
  label = "Upload Image", 
  accept = "image/*",
  buttonText
}: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result as string);
      setLoading(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read the image file");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="text-sm font-medium mb-2">{label}</div>
      )}

      {selectedImage ? (
        <div className="relative group">
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full h-64 object-cover rounded-md border"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onImageSelect(null)}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-md p-4 text-center">
          <input
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2 py-4">
              <Camera className="h-10 w-10 text-muted-foreground" />
              <div className="font-medium">
                {loading ? "Uploading..." : buttonText || "Upload Image"}
              </div>
              <p className="text-xs text-muted-foreground">
                Click to browse (Max: 5MB)
              </p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};
