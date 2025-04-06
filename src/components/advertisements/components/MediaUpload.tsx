
import { useState } from "react";
import { AdFormat } from "@/services/adService";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload/ImageUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface MediaUploadProps {
  format: AdFormat;
  imageUrl: string | null;
  videoUrl: string;
  carouselImages: string[];
  onImageChange: (url: string | null) => void;
  onVideoUrlChange: (url: string) => void;
  onCarouselImagesChange: (urls: string[]) => void;
}

export const MediaUpload = ({
  format,
  imageUrl,
  videoUrl,
  carouselImages,
  onImageChange,
  onVideoUrlChange,
  onCarouselImagesChange,
}: MediaUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  
  // For standard, banner, boosted_post, card, or featured formats
  if (format === "standard" || format === "banner" || format === "boosted_post" || 
      format === "card" || format === "featured") {
    return (
      <div className="space-y-4">
        <ImageUpload
          selectedImage={imageUrl}
          onImageSelect={onImageChange}
          label="Upload Image"
          accept="image/*"
        />
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }
  
  // For video format
  if (format === "video") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Video URL
          </label>
          <Input
            type="url"
            value={videoUrl}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
            className="w-full"
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }
  
  // For carousel format
  if (format === "carousel") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Carousel Images (Up to 5)
          </label>
          {carouselImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {carouselImages.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Carousel image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 w-6 h-6"
                    onClick={() => {
                      const newImages = [...carouselImages];
                      newImages.splice(index, 1);
                      onCarouselImagesChange(newImages);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {carouselImages.length < 5 && (
            <ImageUpload
              selectedImage={null}
              onImageSelect={(url) => {
                if (url) {
                  onCarouselImagesChange([...carouselImages, url]);
                }
              }}
              label=""
              accept="image/*"
              buttonText={
                <div className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image
                </div>
              }
              key={carouselImages.length} // Force re-render after adding
            />
          )}
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }
  
  // Fallback case if none of the formats match
  return (
    <div className="p-4 text-center">
      <p>Unsupported format: {format}</p>
    </div>
  );
};
