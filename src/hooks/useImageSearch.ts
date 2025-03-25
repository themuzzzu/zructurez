
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      
      // Upload the image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `image-search/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('search-images')
        .upload(filePath, imageFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('search-images')
        .getPublicUrl(filePath);
      
      // Process the image using the edge function
      const { data: processResult, error: functionError } = await supabase.functions
        .invoke('process-image-search', {
          body: { imageUrl: publicUrl }
        });
      
      if (functionError) throw functionError;
      
      const description = processResult.description;
      
      if (description && onImageProcessed) {
        onImageProcessed(description);
      }
      
      return description;
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process image. Please try again.");
      toast.error("Failed to process image. Please try again.");
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
      toast.error("Please upload an image file");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      toast.error("Image size should be less than 5MB");
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
