
import { supabase } from "@/integrations/supabase/client";

export const createPost = async ({
  content,
  image,
  category,
  location,
  groupId,
  pollId,
}: {
  content: string;
  image?: string | null;
  category?: string;
  location?: string;
  groupId?: string;
  pollId?: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get profile ID from user ID
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profiles) throw new Error("Profile not found");

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
        .from('post-images')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    // Create post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        profile_id: profiles.id,
        content,
        image_url: imageUrl,
        category,
        location,
        group_id: groupId,
        poll_id: pollId
      })
      .select()
      .single();

    if (postError) throw postError;
    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const incrementViews = async (tableName: string, recordId: string) => {
  try {
    await supabase.rpc('increment_views', {
      table_name: tableName,
      record_id: recordId,
    });
  } catch (error) {
    console.error(`Error incrementing views for ${tableName}:`, error);
  }
};

export const optimizeImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Max width/height for the image
        const MAX_SIZE = 1200;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Get the data URL (base64 string)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

export const generateVideoThumbnail = async (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    video.onloadeddata = () => {
      // Seek to the first frame
      video.currentTime = 0.1;
    };
    
    video.ontimeupdate = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Optimize the thumbnail size
      const thumbnailCanvas = document.createElement('canvas');
      const MAX_SIZE = 600;
      let width = canvas.width;
      let height = canvas.height;
      
      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
      }
      
      thumbnailCanvas.width = width;
      thumbnailCanvas.height = height;
      
      const thumbnailCtx = thumbnailCanvas.getContext('2d');
      thumbnailCtx?.drawImage(canvas, 0, 0, width, height);
      
      const thumbnail = thumbnailCanvas.toDataURL('image/jpeg', 0.85);
      video.pause();
      resolve(thumbnail);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };
    
    video.src = URL.createObjectURL(videoFile);
    video.load();
    video.play().catch(error => {
      console.error('Auto-play failed:', error);
      // Try to generate thumbnail without playing
      video.currentTime = 0.1;
    });
  });
};
