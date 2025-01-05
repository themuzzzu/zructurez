import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ImagePreview } from "./image-upload/ImagePreview";
import { ImageControls } from "./image-upload/ImageControls";
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
  onPositionChange,
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
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
          <ImagePreview
            previewImage={previewImage}
            scale={scale}
            position={position}
            onImageRemove={() => {
              setPreviewImage(null);
              onImageSelect(null);
            }}
            isDragging={isDragging}
            onDragStart={handleMouseDown}
            onDragMove={handleMouseMove}
            onDragEnd={handleMouseUp}
          />

          <ImageControls
            scale={scale}
            onScaleChange={handleScaleChange}
            onPositionChange={(x, y) => {
              const newPosition = { x, y };
              setPosition(newPosition);
              onPositionChange?.(newPosition);
            }}
            onSave={handleSave}
          />
        </div>
      )}
    </div>
  );
};