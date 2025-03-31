
import { useState } from "react";
import { Business } from "@/types/business";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useBusiness } from "@/hooks/useBusiness";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, Upload } from "lucide-react";

interface BusinessImageSectionProps {
  business: Business;
}

export const BusinessImageSection = ({ business }: BusinessImageSectionProps) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const { refetchBusiness } = useBusiness(id as string);

  // State for image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverUploadedUrl, setCoverUploadedUrl] = useState<string | null>(null);
  const [positionValues, setPositionValues] = useState({ x: 50, y: 50 });
  const [scaleValue, setScaleValue] = useState(1);

  const handleProfileImageUpload = async (file: File) => {
    if (!id) return;
    setIsUploading(true);
    
    try {
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `business-profiles/${id}/${timestamp}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('business-images')
        .getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ image_url: publicUrl })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      toast.success("Profile image updated successfully");
      refetchBusiness();
      queryClient.invalidateQueries({ queryKey: ['business', id] });
    } catch (error) {
      console.error('Error uploading business profile image:', error);
      toast.error("Failed to update profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverImageUpload = async (file: File) => {
    if (!id) return;
    setIsCoverUploading(true);
    
    try {
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `business-covers/${id}/${timestamp}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('business-images')
        .getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ 
          cover_url: publicUrl,
          image_position: { x: positionValues.x, y: positionValues.y },
          // Custom fields should be added here as needed for the business table
        })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      toast.success("Cover image updated successfully");
      refetchBusiness();
      queryClient.invalidateQueries({ queryKey: ['business', id] });
    } catch (error) {
      console.error('Error uploading business cover image:', error);
      toast.error("Failed to update cover image");
    } finally {
      setIsCoverUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="relative rounded-xl overflow-hidden">
        <AspectRatio ratio={3/1} className="bg-muted">
          {business.cover_url ? (
            <img 
              src={business.cover_url} 
              alt={`${business.name} cover`} 
              className="object-cover w-full h-full"
              style={{ 
                objectPosition: `${business.image_position?.x || 50}% ${business.image_position?.y || 50}%` 
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-800 to-indigo-900 flex items-center justify-center">
              <span className="text-white text-xl font-medium">{business.name}</span>
            </div>
          )}
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/90 hover:bg-white"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleCoverImageUpload(file);
                };
                input.click();
              }}
              disabled={isCoverUploading}
            >
              <Upload className="h-3.5 w-3.5 mr-1" />
              {isCoverUploading ? 'Uploading...' : 'Upload Cover'}
            </Button>
          </div>
        </AspectRatio>
      </div>
      
      {/* Profile Image */}
      <div className="flex items-end space-x-4">
        <div className="relative -mt-16 ml-6">
          <div className="h-24 w-24 rounded-full border-4 border-background overflow-hidden bg-muted">
            {business.image_url ? (
              <img 
                src={business.image_url} 
                alt={`${business.name} profile`}
                className="object-cover w-full h-full" 
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500 text-xl font-medium">
                  {business.name?.charAt(0) || "B"}
                </span>
              </div>
            )}
            
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white shadow-md"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleProfileImageUpload(file);
                };
                input.click();
              }}
              disabled={isUploading}
            >
              <Camera className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="pb-2">
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <p className="text-muted-foreground text-sm">{business.category}</p>
        </div>
      </div>
    </div>
  );
};
