
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface ImageSearchUploaderProps {
  onClose: () => void;
  onProcessingComplete: (description: string) => void;
}

export function ImageSearchUploader({ onClose, onProcessingComplete }: ImageSearchUploaderProps) {
  const { data: currentUser } = useCurrentUser();
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic validation
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image must be less than 5MB");
        return;
      }
      
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async () => {
    if (!image) {
      toast.error("Please select an image first");
      return;
    }
    
    if (!currentUser) {
      // For users who aren't logged in, just use a demo response
      setTimeout(() => {
        const mockDescription = "black leather boots shoes fashion footwear";
        onProcessingComplete(mockDescription);
      }, 1500);
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Upload to Supabase Storage
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `image-search/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('search-images')
        .upload(filePath, image);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('search-images')
        .getPublicUrl(filePath);
      
      setIsUploading(false);
      setIsProcessing(true);
      
      // Send to image recognition edge function
      const { data: processResult, error: processError } = await supabase.functions
        .invoke('process-image-search', {
          body: { imageUrl: publicUrl },
        });
        
      if (processError) throw processError;
      
      // Save to our database using RPC
      if (currentUser?.id) {
        await supabase.rpc('insert_image_search_with_description', {
          user_id_param: currentUser.id,
          image_url_param: publicUrl,
          description_param: processResult.description
        });
      }
      
      onProcessingComplete(processResult.description);
    } catch (error) {
      console.error('Error processing image search:', error);
      toast.error("Failed to process image search");
      setIsUploading(false);
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search with an Image</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          
          {!previewUrl ? (
            <div 
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={handleUploadClick}
            >
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Click to upload an image or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (Max file size: 5MB)
              </p>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="rounded-lg w-full max-h-64 object-contain"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            We'll analyze your image to find similar products
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading || isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!image || isUploading || isProcessing}
          >
            {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isUploading ? 'Uploading...' : isProcessing ? 'Processing...' : 'Search'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
