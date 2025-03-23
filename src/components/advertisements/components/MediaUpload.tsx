
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload/ImageUpload";
import { Input } from "@/components/ui/input";
import { AdFormat } from "@/services/adService";

interface MediaUploadProps {
  format: AdFormat;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
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
  if (format === 'standard') {
    return (
      <div>
        <Label>Advertisement Image</Label>
        <ImageUpload
          selectedImage={imageUrl}
          onImageSelect={setImageUrl}
          skipAutoSave
        />
      </div>
    );
  }

  if (format === 'banner') {
    return (
      <div>
        <Label>Banner Image (recommended: 1200×300px)</Label>
        <ImageUpload
          selectedImage={imageUrl}
          onImageSelect={setImageUrl}
          skipAutoSave
        />
        <p className="text-sm text-muted-foreground mt-1">Banner ads appear at prominent locations like the top of marketplace</p>
      </div>
    );
  }

  if (format === 'carousel') {
    return (
      <div className="space-y-4">
        <Label>Carousel Images (2-5 images)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {carouselImages.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
              <img 
                src={image} 
                alt={`Carousel image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <Button 
                size="sm" 
                variant="destructive" 
                className="absolute top-1 right-1"
                type="button"
                onClick={() => removeCarouselImage(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          {carouselImages.length < 5 && (
            <div className="aspect-square border border-dashed rounded-md flex items-center justify-center">
              <ImageUpload
                selectedImage={null}
                onImageSelect={(url) => url && addCarouselImage(url)}
                skipAutoSave
              />
            </div>
          )}
        </div>
        {carouselImages.length < 2 && (
          <p className="text-sm text-yellow-500">Add at least 2 images for carousel</p>
        )}
      </div>
    );
  }

  if (format === 'video') {
    return (
      <div>
        <Label>Video URL (YouTube, Vimeo)</Label>
        <Input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="e.g. https://www.youtube.com/watch?v=..."
          required
        />
        <p className="text-sm text-muted-foreground mt-1">Enter a valid video URL from YouTube or Vimeo</p>
      </div>
    );
  }

  return null;
};
