import { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ImagePositionControls } from "./image-upload/ImagePositionControls";
import { ImageZoomControl } from "./image-upload/ImageZoomControl";
import { UploadButtons } from "./image-upload/UploadButtons";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (image: string | null) => void;
}

export const ImageUpload = ({ selectedImage, onImageSelect }: ImageUploadProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleFileUpload = (file: File) => {
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
      setScale(1);
      setPosition({ x: 50, y: 50 });
      toast.success("Photo uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(true);
        };
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error("Could not get canvas context");
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          handleFileUpload(new File([blob], "camera-capture.jpg", { type: "image/jpeg" }));
        }
      }, "image/jpeg");

      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const handlePositionChange = (direction: 'up' | 'down' | 'left' | 'right') => {
    setPosition(prev => {
      const step = 2;
      const newPosition = { ...prev };
      
      switch (direction) {
        case 'up':
          newPosition.y = Math.max(0, prev.y - step);
          break;
        case 'down':
          newPosition.y = Math.min(100, prev.y + step);
          break;
        case 'left':
          newPosition.x = Math.max(0, prev.x - step);
          break;
        case 'right':
          newPosition.x = Math.min(100, prev.x + step);
          break;
      }
      
      return newPosition;
    });
  };

  return (
    <div className="space-y-4">
      <UploadButtons 
        onCameraCapture={handleCameraCapture}
        onFileSelect={handleFileUpload}
      />

      {selectedImage && (
        <div className="space-y-4">
          <div className="relative h-48 overflow-hidden rounded-lg group">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: `scale(${scale})`,
                objectPosition: `${position.x}% ${position.y}%`
              }}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => onImageSelect(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <ImageZoomControl scale={scale} onScaleChange={setScale} />
            <ImagePositionControls onPositionChange={handlePositionChange} />
          </div>
        </div>
      )}
    </div>
  );
};