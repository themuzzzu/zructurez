import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "./ImageUpload";
import { BusinessBasicInfo } from "./business-form/BusinessBasicInfo";
import { BusinessPricing } from "./business-form/BusinessPricing";
import { BusinessContactInfo } from "./business-form/BusinessContactInfo";
import { BusinessProfileInfo } from "./business-form/BusinessProfileInfo";
import { Label } from "./ui/label";
import { BusinessFormData } from "./business-form/types";
import { Json } from "@/integrations/supabase/types";

interface CreateBusinessFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

export const CreateBusinessForm = ({ onSuccess, onCancel, initialData }: CreateBusinessFormProps) => {
  const [loading, setLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [formData, setFormData] = useState<BusinessFormData>({
    name: "",
    category: "",
    description: "",
    location: "",
    contact: "",
    hours: "",
    image: null,
    appointment_price: "",
    consultation_price: "",
    bio: "",
    website: "",
    owners: [{ name: "", role: "Primary Owner", position: "", experience: "" }],
    staff_details: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category || "",
        description: initialData.description || "",
        location: initialData.location || "",
        contact: initialData.contact || "",
        hours: initialData.hours || "",
        image: initialData.image_url || null,
        appointment_price: initialData.appointment_price?.toString() || "",
        consultation_price: initialData.consultation_price?.toString() || "",
        bio: initialData.bio || "",
        website: initialData.website || "",
        owners: initialData.owners || [{ name: "", role: "Primary Owner", position: "", experience: "" }],
        staff_details: initialData.staff_details || [],
      });
      setPendingImage(initialData.image_url || null);
      if (initialData.image_scale) setImageScale(initialData.image_scale);
      if (initialData.image_position) setImagePosition(initialData.image_position);
    }
  }, [initialData]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let imageUrl = pendingImage;

      // Handle main business image upload
      if (pendingImage && 
          (pendingImage.startsWith('data:') || 
           (initialData && pendingImage !== initialData.image_url))) {
        
        if (pendingImage.startsWith('data:')) {
          const base64Data = pendingImage.split(',')[1];
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
      }

      // Process owners' data and handle their images
      const processedOwners = await Promise.all(formData.owners.map(async (owner) => {
        let ownerImageUrl = owner.image_url;
        
        // If the owner has a new image (base64 string), upload it
        if (owner.image_url && owner.image_url.startsWith('data:')) {
          const base64Data = owner.image_url.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });

          const fileName = `owner-${Date.now()}-${Math.random().toString(36).substring(7)}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('business-images')
            .upload(fileName, blob);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('business-images')
            .getPublicUrl(fileName);

          ownerImageUrl = publicUrl;
        }

        return {
          ...owner,
          image_url: ownerImageUrl
        };
      }));

      const businessData = {
        user_id: user.id,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        contact: formData.contact,
        hours: formData.hours,
        image_url: imageUrl,
        appointment_price: formData.appointment_price ? parseFloat(formData.appointment_price) : null,
        consultation_price: formData.consultation_price ? parseFloat(formData.consultation_price) : null,
        bio: formData.bio,
        website: formData.website,
        image_scale: imageScale,
        image_position: imagePosition as Json,
        owners: JSON.parse(JSON.stringify(processedOwners)) as Json,
        staff_details: JSON.parse(JSON.stringify(formData.staff_details)) as Json,
      };

      if (initialData) {
        // Handle deletion of old images
        if (initialData.image_url && imageUrl !== initialData.image_url) {
          const oldFileName = initialData.image_url.split('/').pop();
          if (oldFileName) {
            await supabase.storage
              .from('business-images')
              .remove([oldFileName]);
          }
        }

        // Handle deletion of old owner images
        const oldOwners = initialData.owners || [];
        for (const oldOwner of oldOwners) {
          if (oldOwner.image_url && !processedOwners.some(newOwner => newOwner.image_url === oldOwner.image_url)) {
            const oldFileName = oldOwner.image_url.split('/').pop();
            if (oldFileName) {
              await supabase.storage
                .from('business-images')
                .remove([oldFileName]);
            }
          }
        }

        const { error } = await supabase
          .from('businesses')
          .update(businessData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success("Business updated successfully!");
      } else {
        const { error } = await supabase
          .from('businesses')
          .insert([businessData]);

        if (error) throw error;
        toast.success("Business registered successfully!");
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error(initialData ? "Failed to update business" : "Failed to register business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BusinessBasicInfo formData={formData} onChange={handleChange} />
      <BusinessProfileInfo formData={formData} onChange={handleChange} />
      <BusinessPricing formData={formData} onChange={handleChange} />
      <BusinessContactInfo formData={formData} onChange={handleChange} />

      <div className="space-y-2">
        <Label>Business Image</Label>
        <ImageUpload
          selectedImage={pendingImage}
          onImageSelect={(image) => setPendingImage(image)}
          initialScale={imageScale}
          initialPosition={imagePosition}
          onScaleChange={setImageScale}
          onPositionChange={setImagePosition}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (initialData ? "Updating..." : "Registering...") : (initialData ? "Update Business" : "Register Business")}
        </Button>
      </div>
    </form>
  );
};