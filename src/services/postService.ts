import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        content: content
      });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
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