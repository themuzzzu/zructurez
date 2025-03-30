
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Business } from "@/types/business";

interface BusinessPhotosTabProps {
  businessId?: string;
  businessName?: string;
}

export const BusinessPhotosTab = ({ businessId, businessName }: BusinessPhotosTabProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<Array<{id: string, image_url: string, title: string}>>([]);

  const handleSubmit = async () => {
    if (!businessId) {
      toast.error("Business ID is required");
      return;
    }

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (image) {
        const base64Data = image.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('business-images')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('business-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Here we would normally save to a database, but for now we'll just update the local state
      const newPhoto = {
        id: Math.random().toString(36).substring(7),
        image_url: imageUrl as string,
        title
      };
      
      setPhotos([...photos, newPhoto]);
      toast.success("Photo added successfully!");
      setIsDialogOpen(false);
      setTitle("");
      setImage(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Photos</h2>
        {businessId && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Add New Photo</h3>
                <div className="space-y-2">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <ImageUpload
                    selectedImage={image}
                    onImageSelect={setImage}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Photo"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group overflow-hidden rounded-lg">
              <img 
                src={photo.image_url} 
                alt={photo.title} 
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-3 text-white">
                  <p className="font-medium">{photo.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center animate-fade-in">
          <Camera className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">No photos yet for {businessName || 'this business'}</p>
          {businessId && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsDialogOpen(true)}
            >
              Add first photo
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
