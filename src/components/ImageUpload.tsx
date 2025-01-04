import { useState } from "react";
import { Button } from "./ui/button";
import { X, Camera, ImagePlus, ZoomIn, ZoomOut, Move } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "./ui/slider";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (image: string | null) => void;
}

export const ImageUpload = ({ selectedImage, onImageSelect }: ImageUploadProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // percentage values

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
      setScale(1); // Reset scale when new image is uploaded
      setPosition({ x: 50, y: 50 }); // Reset position
      toast.success("Photo uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileUpload(file);
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

  const handleRemoveImage = () => {
    onImageSelect(null);
    setScale(1);
    setPosition({ x: 50, y: 50 });
    toast.info("Photo removed");
  };

  const handlePositionChange = (direction: 'up' | 'down' | 'left' | 'right') => {
    setPosition(prev => {
      const step = 5;
      switch (direction) {
        case 'up':
          return { ...prev, y: Math.max(0, prev.y - step) };
        case 'down':
          return { ...prev, y: Math.min(100, prev.y + step) };
        case 'left':
          return { ...prev, x: Math.max(0, prev.x - step) };
        case 'right':
          return { ...prev, x: Math.min(100, prev.x + step) };
        default:
          return prev;
      }
    });
  };

  return (
    <div className="space-y-4">
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
          onClick={handleCameraCapture}
        >
          <Camera className="h-4 w-4" />
          Take Photo
        </Button>
        <input
          id="photo-upload"
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>

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
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4" />
                <span className="text-sm">Zoom</span>
              </div>
              <Slider
                value={[scale * 100]}
                onValueChange={(value) => setScale(value[0] / 100)}
                min={100}
                max={200}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Move className="h-4 w-4" />
                <span className="text-sm">Position</span>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePositionChange('up')}
                >
                  ↑
                </Button>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePositionChange('left')}
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePositionChange('down')}
                >
                  ↓
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePositionChange('right')}
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};