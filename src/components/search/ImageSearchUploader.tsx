
import { useRef, useState } from "react";
import { Upload, Camera, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageSearchUploaderProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onCancel: () => void;
}

export function ImageSearchUploader({
  onUpload,
  onCancel,
}: ImageSearchUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Trigger file input click
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Start processing
    setIsProcessing(true);
    
    try {
      await onUpload(e);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    
    // Cleanup
    setTimeout(() => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setPreviewUrl(null);
      setIsProcessing(false);
    }, 3000);
  };
  
  // Cancel upload
  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setIsProcessing(false);
    onCancel();
  };
  
  return (
    <div className="p-4 flex flex-col items-center">
      <h3 className="font-medium text-lg mb-2">Search by Image</h3>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {isProcessing ? (
        <div className="py-6 flex flex-col items-center">
          {previewUrl && (
            <div className="relative w-40 h-40 mb-4 rounded-lg overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Uploaded preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            </div>
          )}
          <p className="text-muted-foreground">Processing image...</p>
        </div>
      ) : previewUrl ? (
        <div className="py-6 flex flex-col items-center">
          <div className="relative w-40 h-40 mb-4 rounded-lg overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Uploaded preview" 
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"
              onClick={() => {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-muted-foreground">Image selected</p>
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center">
          <div className="w-40 h-40 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center mb-4 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={handleButtonClick}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center px-2">
              Click to upload an image
            </p>
          </div>
          <p className="text-center text-muted-foreground text-sm max-w-[200px]">
            Take a photo of something to search for similar items
          </p>
        </div>
      )}
      
      <div className="flex gap-2 w-full">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        
        {!isProcessing && !previewUrl && (
          <Button
            variant="default"
            className="flex-1 gap-2"
            onClick={handleButtonClick}
          >
            <Camera className="h-4 w-4" />
            Select Image
          </Button>
        )}
      </div>
    </div>
  );
}
