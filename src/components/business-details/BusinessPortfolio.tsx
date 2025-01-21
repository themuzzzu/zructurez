import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Business } from "@/types/business";
import { incrementViews } from "@/services/postService";
import { Eye } from "lucide-react";

interface BusinessPortfolioTabProps {
  portfolio: Business['business_portfolio'];
  businessId?: string;
}

export const BusinessPortfolioTab = ({ portfolio, businessId }: BusinessPortfolioTabProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!businessId) {
      toast.error("Business ID is required");
      return;
    }

    if (!title.trim()) {
      toast.error("Title is required");
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

      const { error } = await supabase
        .from('business_portfolio')
        .insert({
          business_id: businessId,
          title,
          description: description.trim() || null,
          image_url: imageUrl,
        });

      if (error) throw error;

      toast.success("Portfolio item added successfully!");
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add portfolio item");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Increment view count for each portfolio item when rendered
    portfolio.forEach(item => {
      incrementViews('business_portfolio', item.id);
    });
  }, [portfolio]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Notable Works</h2>
        {businessId && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Work
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Add New Work</h3>
                <div className="space-y-2">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                  {isSubmitting ? "Adding..." : "Add Work"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {portfolio.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden">
            {item.image_url && (
              <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{item.views || 0} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
