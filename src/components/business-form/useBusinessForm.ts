import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BusinessFormData } from "./types/form";
import { Json } from "@/integrations/supabase/types";

export const useBusinessForm = (initialData?: any, onSuccess?: () => void) => {
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
    owners: [{ name: "", role: "Primary Owner", position: "", experience: "", image_url: null }],
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
        owners: initialData.owners || [{ name: "", role: "Primary Owner", position: "", experience: "", image_url: null }],
        staff_details: initialData.staff_details || [],
      });
      setPendingImage(initialData.image_url || null);
      if (initialData.image_scale) setImageScale(initialData.image_scale);
      if (initialData.image_position) setImagePosition(initialData.image_position);
    }
  }, [initialData]);

  const uploadImage = async (base64Image: string, prefix: string = '') => {
    if (!base64Image.startsWith('data:')) {
      return base64Image;
    }

    try {
      const base64Data = base64Image.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const fileName = `${prefix}${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(fileName, blob);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('business-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
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

      // Upload main business image
      let imageUrl = null;
      try {
        if (pendingImage) {
          imageUrl = await uploadImage(pendingImage, 'business-');
        }
      } catch (error) {
        console.error('Error uploading main image:', error);
        toast.error("Failed to upload main business image");
        setLoading(false);
        return;
      }

      // Process owners' images
      const processedOwners = await Promise.all(formData.owners.map(async (owner) => {
        let ownerImageUrl = owner.image_url;
        try {
          if (owner.image_url && owner.image_url.startsWith('data:')) {
            ownerImageUrl = await uploadImage(owner.image_url, 'owner-');
          }
        } catch (error) {
          console.error('Error uploading owner image:', error);
          toast.error(`Failed to upload image for owner ${owner.name}`);
          throw error;
        }
        return {
          ...owner,
          image_url: ownerImageUrl
        };
      }));

      // Clean up old images if updating
      if (initialData) {
        if (initialData.image_url && imageUrl !== initialData.image_url) {
          const oldFileName = initialData.image_url.split('/').pop();
          if (oldFileName) {
            await supabase.storage
              .from('business-images')
              .remove([oldFileName]);
          }
        }

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
      }

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

      console.log('Submitting business data:', businessData);

      if (initialData) {
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

  return {
    formData,
    setFormData,
    loading,
    pendingImage,
    setPendingImage,
    imageScale,
    setImageScale,
    imagePosition,
    setImagePosition,
    handleSubmit,
  };
};