import { useState } from "react";
import { Button } from "./ui/button";
import { X, Camera, ImagePlus } from "lucide-react";
import { toast } from "sonner";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (image: string | null) => void;
}

export const ImageUpload = ({ selectedImage, onImageSelect }: ImageUploadProps) => {
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
      
      // Wait for the video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(true);
        };
      });

      // Create a canvas to capture the image
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error("Could not get canvas context");
      }

      // Draw the video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas to a blob
      canvas.toBlob((blob) => {
        if (blob) {
          handleFileUpload(new File([blob], "camera-capture.jpg", { type: "image/jpeg" }));
        }
      }, "image/jpeg");

      // Stop all video streams
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const handleRemoveImage = () => {
    onImageSelect(null);
    toast.info("Photo removed");
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
    </div>
  );
};