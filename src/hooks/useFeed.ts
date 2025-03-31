
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPost } from "@/types/business";

export const useFeed = () => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Fetch posts from the database
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:profile_id (username, avatar_url),
          likes:likes(id),
          comments:comments(id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data
      const transformedPosts: UserPost[] = data.map((post: any) => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        image_url: post.image_url,
        created_at: post.created_at,
        likes_count: post.likes?.length || 0,
        comments_count: post.comments?.length || 0,
        reposts_count: 0, // We'll implement this later
        profile: post.profiles || {
          username: "Anonymous",
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`
        }
      }));

      setPosts(transformedPosts);
    } catch (err: any) {
      console.error("Error fetching feed:", err);
      setError(err.message || "Failed to load feed");
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [refreshTrigger]);

  const refreshFeed = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { posts, loading, error, refreshFeed };
};
