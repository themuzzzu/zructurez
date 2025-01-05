import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ImagePositionControls } from "./image-upload/ImagePositionControls";
import { ImageZoomControl } from "./image-upload/ImageZoomControl";
import { UploadButtons } from "./image-upload/UploadButtons";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface ImagePosition {
  x: number;
  y: number;
}

export interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (image: string | null) => void;
  initialScale?: number;
  initialPosition?: ImagePosition;
  onScaleChange?: (scale: number) => void;
  onPositionChange?: (position: ImagePosition) => void;
}

export const ImageUpload = ({ 
  selectedImage, 
  onImageSelect,
  initialScale = 1,
  initialPosition = { x: 50, y: 50 },
  onScaleChange,
  onPositionChange
}: ImageUploadProps) => {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState(initialPosition);
  const [previewImage, setPreviewImage] = useState<string | null>(selectedImage);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPreviewImage(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    setScale(initialScale);
  }, [initialScale]);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

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
      const result = e.target?.result as string;
      setPreviewImage(result);
      setScale(1);
      setPosition({ x: 50, y: 50 });
      onScaleChange?.(1);
      onPositionChange?.({ x: 50, y: 50 });
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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(100, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(100, e.clientY - dragStart.y));
    
    setPosition({ x: newX, y: newY });
    onPositionChange?.({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    onImageSelect(previewImage);
  };

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    onScaleChange?.(newScale);
  };

  return (
    <div className="space-y-4">
      <UploadButtons 
        onCameraCapture={handleCameraCapture}
        onFileSelect={handleFileUpload}
      />

      {previewImage && (
        <div className="space-y-4">
          <div 
            className="relative h-48 overflow-hidden rounded-lg group cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: `scale(${scale})`,
                objectPosition: `${position.x}% ${position.y}%`,
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => {
                setPreviewImage(null);
                onImageSelect(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <ImageZoomControl scale={scale} onScaleChange={handleScaleChange} />
            <ImagePositionControls onPositionChange={(x, y) => {
              const newPosition = { x, y };
              setPosition(newPosition);
              onPositionChange?.(newPosition);
            }} />
            <Button 
              className="w-full" 
              onClick={handleSave}
            >
              Apply Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};