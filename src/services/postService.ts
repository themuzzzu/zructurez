
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

export const getPosts = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (username, avatar_url),
        likes (user_id),
        comments (id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(post => ({
      ...post,
      likes: post.likes?.length || 0,
      comments: post.comments?.length || 0,
      user_has_liked: post.likes?.some((like: any) => like.user_id === user?.id) || false
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getComments = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profile:profiles!comments_profile_id_fkey (username, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (postId: string, content: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to comment");
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        profile_id: user.id,
        content: content
      });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Image optimization function
export const optimizeImage = async (imageFile: File): Promise<string> => {
  try {
    // Options for compression
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: imageFile.type
    };

    // Compress the image
    const compressedFile = await imageCompression(imageFile, options);
    
    // Convert to base64 for preview or storage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
};

// Generate video thumbnail
export const generateVideoThumbnail = async (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    video.onloadedmetadata = () => {
      // Seek to a position (e.g., 1 second)
      video.currentTime = 1;
    };
    
    video.onseeked = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(thumbnailUrl);
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    
    video.onerror = () => {
      reject(new Error('Error generating video thumbnail'));
    };
    
    // Set the video source
    video.src = URL.createObjectURL(videoFile);
  });
};

export const createPost = async ({ content, location, image, category }: {
  content: string;
  location?: string;
  image?: string | null;
  category?: string | null;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) throw new Error('Profile not found');

    const { error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        profile_id: profile.id,
        content,
        location,
        image_url: image,
        category
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Schedule a post for later
export const schedulePost = async ({ 
  content, 
  location, 
  image, 
  category,
  scheduledFor,
  groupId 
}: {
  content: string;
  location?: string;
  image?: string | null;
  category?: string | null;
  scheduledFor: Date;
  groupId?: string | null;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if scheduled time is in the future
    if (scheduledFor <= new Date()) {
      throw new Error('Scheduled time must be in the future');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) throw new Error('Profile not found');

    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert({
        user_id: user.id,
        profile_id: profile.id,
        group_id: groupId || null,
        content,
        location,
        image_url: image,
        category,
        scheduled_for: scheduledFor.toISOString(),
        status: 'pending'
      })
      .select();

    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error scheduling post:', error);
    throw error;
  }
};

// Get scheduled posts for current user
export const getScheduledPosts = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        groups (name, image_url)
      `)
      .eq('user_id', user.id)
      .order('scheduled_for', { ascending: true });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    throw error;
  }
};

// Cancel a scheduled post
export const cancelScheduledPost = async (postId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('scheduled_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error canceling scheduled post:', error);
    throw error;
  }
};

// Update a scheduled post
export const updateScheduledPost = async (
  postId: string, 
  updates: {
    content?: string;
    category?: string;
    location?: string;
    image_url?: string;
    scheduled_for?: Date;
  }
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Convert scheduledFor to ISO string if it exists
    const formattedUpdates = {
      ...updates,
      scheduled_for: updates.scheduled_for ? updates.scheduled_for.toISOString() : undefined
    };

    const { error } = await supabase
      .from('scheduled_posts')
      .update(formattedUpdates)
      .eq('id', postId)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating scheduled post:', error);
    throw error;
  }
};

export const likePost = async (postId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: user.id
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const unlikePost = async (postId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('likes')
      .delete()
      .match({ post_id: postId, user_id: user.id });

    if (error) throw error;
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const updatePost = async (postId: string, content: string, category: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('posts')
      .update({ content, category })
      .eq('id', postId)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const incrementViews = async (tableType: 'posts' | 'products' | 'business_portfolio' | 'service_portfolio', id: string) => {
  try {
    const { error } = await supabase.rpc('increment_views', {
      table_name: tableType,
      record_id: id
    });

    if (error) throw error;
  } catch (error) {
    console.error(`Error incrementing views for ${tableType}:`, error);
  }
};
