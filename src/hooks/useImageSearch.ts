
import { useState, useCallback } from "react";
import { saveImageSearch, processImageSearch } from "@/services/searchService";

interface UseImageSearchProps {
  onImageProcessed?: (description: string) => void;
}

export const useImageSearch = ({ onImageProcessed }: UseImageSearchProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Process an image for search
  const processImage = useCallback(async (imageFile: File) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      
      // Resize/compress the image if needed (optional step)
      // For this example, we'll just use the original
      
      // Upload the image
      const imageData = await saveImageSearch(imageFile);
      
      if (!imageData) {
        throw new Error("Failed to upload image");
      }
      
      // Process the image
      const description = await processImageSearch(imageData.id);
      
      if (description && onImageProcessed) {
        onImageProcessed(description);
      }
      
      return description;
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process image. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [onImageProcessed]);
  
  // Handle file input change
  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    
    await processImage(file);
    
    // Reset the input to allow selecting the same file again
    event.target.value = '';
  }, [processImage]);
  
  // Clear the preview
  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  }, [previewUrl]);
  
  return {
    isLoading,
    error,
    previewUrl,
    processImage,
    handleImageUpload,
    clearPreview,
  };
};
