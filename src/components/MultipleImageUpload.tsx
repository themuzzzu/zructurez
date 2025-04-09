
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { Card } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface MultipleImageUploadProps {
  selectedImages: (string | null)[];
  onImagesChange: (images: (string | null)[]) => void;
  maxImages?: number;
}

export const MultipleImageUpload = ({
  selectedImages = [],
  onImagesChange,
  maxImages = 3
}: MultipleImageUploadProps) => {
  const [activeUploadIndex, setActiveUploadIndex] = useState<number | null>(null);
  
  const handleAddImage = () => {
    if (selectedImages.length >= maxImages) {
      toast.error(`Maximum of ${maxImages} images allowed`);
      return;
    }
    
    const newImages = [...selectedImages, null];
    onImagesChange(newImages);
    setActiveUploadIndex(newImages.length - 1);
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    onImagesChange(newImages);
    
    if (activeUploadIndex === index) {
      setActiveUploadIndex(null);
    } else if (activeUploadIndex !== null && activeUploadIndex > index) {
      setActiveUploadIndex(activeUploadIndex - 1);
    }
  };
  
  const handleImageSelect = (image: string | null, index: number) => {
    const newImages = [...selectedImages];
    newImages[index] = image;
    onImagesChange(newImages);
    setActiveUploadIndex(null);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {selectedImages.map((image, index) => (
          <Card key={index} className="relative group overflow-hidden">
            {image ? (
              <>
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100"
                  onClick={() => setActiveUploadIndex(index)}
                >
                  Change
                </Button>
              </>
            ) : (
              <div className="h-32 flex items-center justify-center border-dashed border-2 border-gray-300">
                <Button variant="ghost" onClick={() => setActiveUploadIndex(index)}>
                  <Plus className="h-6 w-6 text-gray-400" />
                </Button>
              </div>
            )}
          </Card>
        ))}
        
        {selectedImages.length < maxImages && (
          <Card 
            className="h-32 flex items-center justify-center border-dashed border-2 border-gray-300 cursor-pointer"
            onClick={handleAddImage}
          >
            <Plus className="h-6 w-6 text-gray-400" />
            <span className="ml-2 text-gray-500">Add Image</span>
          </Card>
        )}
      </div>
      
      {activeUploadIndex !== null && (
        <div className="mt-4">
          <Card className="p-4">
            <h3 className="font-medium mb-2">Upload Image {activeUploadIndex + 1}</h3>
            <ImageUpload
              selectedImage={selectedImages[activeUploadIndex]}
              onImageSelect={(image) => handleImageSelect(image, activeUploadIndex)}
              buttonText="Choose Product Image"
            />
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveUploadIndex(null)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
