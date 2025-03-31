
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPost } from "@/types/business";

export const useFeed = () => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeed = async () => {
    setLoading(true);
    try {
      // Fetch posts
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          user_id,
          content,
          image_url,
          created_at,
          category,
          profiles:profile_id (id, username, avatar_url, name)
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      if (!data || data.length === 0) {
        setPosts([]);
        return;
      }

      // Transform data into UserPost format
      const transformedPosts: UserPost[] = data.map(post => ({
        id: post.id,
        user_id: post.user_id,
        profile_id: post.profiles?.id || '',
        content: post.content,
        image_url: post.image_url,
        created_at: post.created_at,
        category: post.category,
        likes_count: Math.floor(Math.random() * 50), // Mock data for demonstration
        comments_count: Math.floor(Math.random() * 20), // Mock data for demonstration
        reposts_count: Math.floor(Math.random() * 10), // Mock data for demonstration
        profile: {
          id: post.profiles?.id || '',
          username: post.profiles?.username || 'user',
          avatar_url: post.profiles?.avatar_url,
          full_name: post.profiles?.name || 'Anonymous User'
        }
      }));

      setPosts(transformedPosts);
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError(err instanceof Error ? err.message : "Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh the feed
  const refreshFeed = () => {
    fetchFeed();
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return { posts, loading, error, refreshFeed };
};
