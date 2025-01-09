import { supabase } from "@/integrations/supabase/client";

export const uploadBusinessImage = async (base64Image: string, prefix: string = '') => {
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

export const processOwnerImages = async (owners: any[]) => {
  return Promise.all(owners.map(async (owner) => {
    let ownerImageUrl = owner.image_url;
    try {
      if (owner.image_url && owner.image_url.startsWith('data:')) {
        ownerImageUrl = await uploadBusinessImage(owner.image_url, 'owner-');
      }
    } catch (error) {
      console.error('Error uploading owner image:', error);
      throw error;
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
      throw error;
    }
    return {
      ...staff,
      image_url: staffImageUrl
    };
  }));
};