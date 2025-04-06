
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdFormat } from "@/services/adService";

interface MediaUploadProps {
  format: AdFormat;
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  carouselImages: string[];
  addCarouselImage: (url: string) => void;
  removeCarouselImage: (index: number) => void;
}

export const MediaUpload = ({
  format,
  imageUrl,
  setImageUrl,
  videoUrl,
  setVideoUrl,
  carouselImages,
  addCarouselImage,
  removeCarouselImage
}: MediaUploadProps) => {
  const [tempImageUrl, setTempImageUrl] = useState("");
  
  // Standard image upload
  const isStandardFormat = format === 'standard' || format === 'banner' || format === 'card' || format === 'featured';
  
  // Video upload
  const isVideoFormat = format === 'video';
  
  // Carousel images
  const isCarouselFormat = format === 'carousel';
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleAddCarouselImage = () => {
    if (tempImageUrl) {
      addCarouselImage(tempImageUrl);
      setTempImageUrl("");
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Media Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Standard Image Upload */}
        {isStandardFormat && (
          <div className="space-y-4">
            <Label>Upload Image</Label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended size: 1200x628 pixels
                </p>
              </div>
              <div className="flex-1">
                <Label htmlFor="image-url">Or enter image URL</Label>
                <Input
                  id="image-url"
                  value={imageUrl || ""}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            {imageUrl && (
              <div className="mt-4 relative">
                <img 
                  src={imageUrl} 
                  alt="Ad Preview" 
                  className="max-h-60 rounded-md shadow-sm"
                />
                <button 
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                  aria-label="Remove image"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Video Upload */}
        {isVideoFormat && (
          <div className="space-y-4">
            <Label htmlFor="video-url">Video URL</Label>
            <Input
              id="video-url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
            />
            {videoUrl && videoUrl.includes('youtube.com') && (
              <div className="mt-4">
                <iframe 
                  width="100%" 
                  height="315" 
                  src={videoUrl.replace('watch?v=', 'embed/')} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}
        
        {/* Carousel Images */}
        {isCarouselFormat && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="carousel-image-url">Add Carousel Image URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="carousel-image-url"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddCarouselImage}
                    disabled={!tempImageUrl}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            {carouselImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {carouselImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image} 
                      alt={`Carousel Image ${index + 1}`} 
                      className="h-40 w-full object-cover rounded-md shadow-sm"
                    />
                    <button 
                      onClick={() => removeCarouselImage(index)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-sm text-muted-foreground mt-1">
              Add up to 5 images for your carousel (1080x1080 pixels recommended)
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
