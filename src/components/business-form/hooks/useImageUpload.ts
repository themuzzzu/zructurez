import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadBusinessImage = async (base64Image: string, prefix: string = '') => {
  // If the image is already a URL, return it
  if (!base64Image.startsWith('data:')) {
    return base64Image;
  }

  try {
    // Convert base64 to blob
    const base64Data = base64Image.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    // Generate unique filename
    const fileName = `${prefix}${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('business-images')
      .upload(fileName, blob);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('business-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
};

export const processOwnerImages = async (owners: any[]) => {
  return Promise.all(owners.map(async (owner) => {
    let ownerImageUrl = owner.image_url;
    try {
      if (owner.image_url && owner.image_url.startsWith('data:')) {
        ownerImageUrl = await uploadBusinessImage(owner.image_url, 'owner-');
      }
    } catch (error) {
      console.error('Error uploading owner image:', error);
      toast.error(`Failed to upload image for owner ${owner.name}`);
    }
    return {
      ...owner,
      image_url: ownerImageUrl
    };
  }));
};

export const processStaffImages = async (staffDetails: any[]) => {
  return Promise.all(staffDetails.map(async (staff) => {
    let staffImageUrl = staff.image_url;
    try {
      if (staff.image_url && staff.image_url.startsWith('data:')) {
        staffImageUrl = await uploadBusinessImage(staff.image_url, 'staff-');
      }
    } catch (error) {
      console.error('Error uploading staff image:', error);
      toast.error(`Failed to upload image for staff member ${staff.name}`);
    }
    return {
      ...staff,
      image_url: staffImageUrl
    };
  }));
};