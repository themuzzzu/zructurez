
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { MediaUploadProps } from "../types";
import { X } from "lucide-react";

export function MediaUpload({
  format,
  imageUrl,
  setImageUrl,
  videoUrl,
  setVideoUrl,
  carouselImages,
  addCarouselImage,
  removeCarouselImage
}: MediaUploadProps) {
  return (
    <div className="space-y-4">
      {(format === 'standard' || format === 'banner') && (
        <div>
          <Label>Advertisement Image</Label>
          <ImageUpload
            selectedImage={imageUrl}
            onImageSelect={setImageUrl}
            skipAutoSave
          />
        </div>
      )}

      {format === 'video' && (
        <div>
          <Label>Video URL</Label>
          <Input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
          />
        </div>
      )}

      {format === 'carousel' && (
        <div>
          <Label>Carousel Images (Max 5)</Label>
          <div className="space-y-4 mt-2">
            {carouselImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Carousel image ${index + 1}`}
                  className="h-32 w-full object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => removeCarouselImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {carouselImages.length < 5 && (
              <div>
                <ImageUpload
                  selectedImage={null}
                  onImageSelect={(url) => {
                    if (url) addCarouselImage(url);
                  }}
                  skipAutoSave
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
