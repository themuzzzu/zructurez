
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImagePreview } from "@/components/image-preview/ImagePreview";

interface BusinessPhotosTabProps {
  businessId?: string;
  businessName?: string;
}

interface BusinessPhoto {
  id: string;
  image_url: string;
  title: string;
}

export const BusinessPhotosTab = ({ businessId, businessName }: BusinessPhotosTabProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<BusinessPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (businessId) {
      fetchBusinessPhotos();
    } else {
      setIsLoading(false);
    }
  }, [businessId]);

  const fetchBusinessPhotos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('business_photos')
        .select('*')
        .eq('business_id', businessId);
        
      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching business photos:', error);
      toast.error('Failed to load business photos');
    } finally {
      setIsLoading(false);
    }
  };

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

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('business-photos')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('business-photos')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { data, error } = await supabase
        .from('business_photos')
        .insert({
          business_id: businessId,
          title: title.trim(),
          image_url: imageUrl
        })
        .select()
        .single();

      if (error) throw error;
      
      setPhotos([...photos, data]);
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
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative overflow-hidden rounded-lg">
              <ImagePreview
                imageUrl={photo.image_url}
                altText={photo.title}
                aspectRatio="square"
                objectFit="cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white font-medium truncate">{photo.title}</p>
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
