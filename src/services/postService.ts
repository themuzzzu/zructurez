import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreatePostData {
  content: string;
  location: string | null;
  image: string | null;
  category: string | null;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  location: string | null;
  category: string | null;
  created_at: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  likes: number;
  comments: number;
  user_has_liked: boolean;
}

export const createPost = async (postData: CreatePostData) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: userData.user.id,
      content: postData.content,
      image_url: postData.image,
      location: postData.location,
      category: postData.category,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }

  return data;
};

export const getPosts = async () => {
  const { data: userData } = await supabase.auth.getUser();
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        username,
        avatar_url
      ),
      likes: likes(count),
      comments: comments(count),
      user_has_liked: likes!inner(id)
    `)
    .eq(userData.user ? 'likes.user_id' : 'id', userData.user?.id || '')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }

  return posts as Post[];
};

export const likePost = async (postId: string) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('likes')
    .insert({
      user_id: userData.user.id,
      post_id: postId,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique violation
      toast.error('You have already liked this post');
    } else {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  return data;
};

export const unlikePost = async (postId: string) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userData.user.id);

  if (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const addComment = async (postId: string, content: string) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userData.user.id,
      post_id: postId,
      content,
    })
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    throw error;
  }

  return data;
};

export const getComments = async (postId: string) => {
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }

  return comments;
};