
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdFormValues } from "../types";
import { AdFormat } from "@/services/adService";

export const useSubmitAdvertisement = (
  formValues: AdFormValues,
  setLoading: (loading: boolean) => void,
  onClose: () => void
) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      startDate,
      endDate,
      selectedItemId,
      budget,
      type,
      format,
      title,
      description,
      location,
      imageUrl,
      videoUrl,
      carouselImages,
      targetingLocations,
      targetingInterests,
      targetAgeMin,
      targetAgeMax,
      targetGender
    } = formValues;

    if (!startDate || !endDate || !selectedItemId || !budget) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let finalImageUrl = imageUrl;
      if (imageUrl && imageUrl.startsWith('data:')) {
        finalImageUrl = await uploadImageToStorage(imageUrl, 'ad');
      }

      // Process carousel images if needed
      let finalCarouselImages: string[] = [];
      if (format === 'carousel' && carouselImages.length > 0) {
        for (let i = 0; i < carouselImages.length; i++) {
          const image = carouselImages[i];
          if (image.startsWith('data:')) {
            const uploadedUrl = await uploadImageToStorage(image, `carousel-${i}`);
            finalCarouselImages.push(uploadedUrl);
          } else {
            finalCarouselImages.push(image);
          }
        }
      }

      const { error } = await supabase.from('advertisements').insert({
        user_id: user.id,
        title,
        description,
        type,
        format,
        reference_id: selectedItemId,
        location,
        budget: parseFloat(budget),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        image_url: finalImageUrl,
        video_url: format === 'video' ? videoUrl : null,
        carousel_images: format === 'carousel' ? finalCarouselImages : null,
        targeting_locations: targetingLocations.length > 0 ? targetingLocations : null,
        targeting_interests: targetingInterests.length > 0 ? targetingInterests : null,
        targeting_age_min: targetAgeMin ? parseInt(targetAgeMin) : null,
        targeting_age_max: targetAgeMax ? parseInt(targetAgeMax) : null,
        targeting_gender: targetGender !== 'all' ? targetGender : null,
      });

      if (error) throw error;
      toast.success("Advertisement created successfully");
      onClose();
    } catch (error) {
      console.error('Error creating advertisement:', error);
      toast.error("Failed to create advertisement");
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToStorage = async (base64Image: string, prefix: string): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `${prefix}-${timestamp}.jpg`;
    
    // Convert base64 to blob
    const base64Data = base64Image.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('business-images')
      .upload(fileName, blob);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('business-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return { handleSubmit };
};
