
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useBusiness } from "@/hooks/useBusiness";

interface BusinessImageSectionProps {
  businessId: string;
}

export const BusinessImageSection = ({ businessId }: BusinessImageSectionProps) => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const { business, refetchBusiness } = useBusiness(businessId);
  const [coverUrl, setCoverUrl] = useState<string | null>(business?.cover_url || null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCoverUrl, setNewCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    if (business) {
      setCoverUrl(business.cover_url || null);
    }
  }, [business]);

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data, error } = await supabase.storage
        .from('business-covers')
        .upload(`${businessId}/${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Failed to upload the cover image.",
          variant: "destructive",
        });
        return;
      }

      const coverPath = data.path;
      // Fix: Use the correct way to get storage URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-covers')
        .getPublicUrl(coverPath);
        
      setNewCoverUrl(publicUrl);
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Failed to upload the cover image.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCover = async () => {
    if (!newCoverUrl) return;

    const { error } = await supabase
      .from('businesses')
      .update({ cover_url: newCoverUrl })
      .eq('id', businessId);

    if (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Failed to update the cover image URL.",
        variant: "destructive",
      });
      return;
    }

    setCoverUrl(newCoverUrl);
    setNewCoverUrl(null);
    setIsDialogOpen(false);
    refetchBusiness();

    toast({
      title: "Success!",
      description: "Cover image updated successfully.",
    });
  };

  return (
    <div className="relative w-full h-64 rounded-md overflow-hidden">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt="Business Cover"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
          No Cover Image
        </div>
      )}
      {profile?.id === business?.owner_id && (
        <div className="absolute top-2 right-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="icon">
                <Upload className="h-4 w-4 mr-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Cover Image</DialogTitle>
                <DialogDescription>
                  Upload a new cover image for your business.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cover" className="text-right">
                    Cover Image
                  </Label>
                  <Input
                    type="file"
                    id="cover"
                    className="col-span-3"
                    onChange={handleCoverChange}
                  />
                </div>
              </div>
              <Button onClick={handleSaveCover}>Save changes</Button>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
