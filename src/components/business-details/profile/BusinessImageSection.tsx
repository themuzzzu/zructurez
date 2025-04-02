
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Edit, Upload } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useBusiness } from "@/hooks/useBusiness";
import { ImagePreview } from "@/components/image-preview/ImagePreview";

interface BusinessImageSectionProps {
  business: string;
}

export const BusinessImageSection = ({ business }: BusinessImageSectionProps) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<"profile" | "cover">("profile");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [isUploading, setIsUploading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const { business: businessData, isLoading, error, refetchBusiness } = useBusiness(business);
  
  const openUploadDialog = (type: "profile" | "cover") => {
    setUploadType(type);
    setPendingImage(null);
    setIsUploadOpen(true);
  };

  const openPreviewDialog = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setIsPreviewOpen(true);
  };
  
  const handleImageSelect = (image: string | null) => {
    setPendingImage(image);
  };
  
  const saveImage = async () => {
    if (!pendingImage) return;
    
    setIsUploading(true);
    try {
      // Convert base64 to blob
      const base64Data = pendingImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
      // Generate filename
      const fileName = `${business}-${uploadType}-${Date.now()}.jpg`;
      
      // Select appropriate bucket based on upload type
      const bucket = uploadType === "profile" ? 'business-profile-images' : 'business-cover-images';
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, blob);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      // Update business record
      const updateData = uploadType === "profile" 
        ? { 
            image_url: publicUrl,
            image_scale: imageScale,
            image_position: imagePosition
          } 
        : { cover_url: publicUrl };
      
      const { error: updateError } = await supabase
        .from('businesses')
        .update(updateData)
        .eq('id', business);
      
      if (updateError) throw updateError;
      
      toast.success(`Business ${uploadType} image updated`);
      setIsUploadOpen(false);
      refetchBusiness();
      
    } catch (error) {
      console.error("Error saving image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };
  
  if (isLoading) {
    return <Card className="w-full h-48 animate-pulse bg-muted" />;
  }
  
  return (
    <>
      <Card className="overflow-hidden relative">
        <div 
          className="w-full h-48 bg-cover bg-center bg-no-repeat cursor-pointer"
          style={{ 
            backgroundImage: businessData?.cover_url ? `url(${businessData.cover_url})` : "linear-gradient(to right, #4f46e5, #2563eb)"
          }}
          onClick={() => businessData?.cover_url && openPreviewDialog(businessData.cover_url)}
        >
          {!isMobile && (
            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute top-2 right-2 opacity-80 hover:opacity-100"
              onClick={() => openUploadDialog("cover")}
            >
              <Upload className="h-4 w-4 mr-1" />
              Cover Photo
            </Button>
          )}
        </div>
        
        <div className="p-4 flex items-end">
          <div className="relative -mt-16">
            <div 
              className="w-20 h-20 rounded-full border-4 border-background overflow-hidden bg-primary cursor-pointer"
              style={{ 
                backgroundImage: businessData?.image_url ? `url(${businessData.image_url})` : "none",
                backgroundSize: "cover",
                backgroundPosition: `${businessData?.image_position?.x || 50}% ${businessData?.image_position?.y || 50}%`
              }}
              onClick={() => businessData?.image_url && openPreviewDialog(businessData.image_url)}
            />
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
              onClick={() => openUploadDialog("profile")}
            >
              <Camera className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="ml-4 flex-1">
            <h2 className="text-xl font-bold truncate">{businessData?.name}</h2>
            <p className="text-sm text-muted-foreground truncate">
              {businessData?.category}
              {businessData?.verified && " • Verified"}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Image Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogTitle>
            {uploadType === "profile" ? "Update Business Logo" : "Update Cover Image"}
          </DialogTitle>
          <div className="space-y-4">
            <Label>{uploadType === "profile" ? "Business Logo" : "Cover Image"}</Label>
            <ImageUpload
              selectedImage={pendingImage}
              onImageSelect={handleImageSelect}
              initialScale={imageScale}
              initialPosition={imagePosition}
              onScaleChange={setImageScale}
              onPositionChange={setImagePosition}
              skipAutoSave={true}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
              <Button onClick={saveImage} disabled={isUploading || !pendingImage}>
                {isUploading ? "Saving..." : "Save Image"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-size Image Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl w-full p-0 h-auto overflow-hidden bg-black/90">
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-white z-10 bg-black/40 hover:bg-black/60"
              onClick={() => setIsPreviewOpen(false)}
            >
              <Camera className="h-4 w-4" />
            </Button>
            {previewImage && (
              <img
                src={previewImage}
                alt="Business image"
                className="max-h-[85vh] max-w-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
