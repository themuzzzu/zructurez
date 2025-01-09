import { toast } from "sonner";
import { ImagePosition } from "../types";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface UseImageUploadHandlersProps {
  setPreviewImage: (image: string | null) => void;
  setScale: (scale: number) => void;
  setPosition: (position: ImagePosition) => void;
  onImageSelect: (image: string | null) => void;
  onScaleChange?: (scale: number) => void;
  onPositionChange?: (position: ImagePosition) => void;
  skipAutoSave?: boolean;
}

export const useImageUploadHandlers = ({
  setPreviewImage,
  setScale,
  setPosition,
  onImageSelect,
  onScaleChange,
  onPositionChange,
  skipAutoSave = false,
}: UseImageUploadHandlersProps) => {
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
      
      if (!skipAutoSave) {
        onImageSelect(result);
        onScaleChange?.(1);
        onPositionChange?.({ x: 50, y: 50 });
      }
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

  return {
    handleFileUpload,
    handleCameraCapture,
  };
};