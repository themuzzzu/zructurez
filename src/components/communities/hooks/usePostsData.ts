
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "../types/postTypes";
import { transformPosts } from "../utils/postTransformUtils";

export const usePostsData = (
  selectedGroup: string | null, 
  refreshTrigger: number,
  sortBy: string = "newest",
  userPosts?: string
) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [selectedGroup, refreshTrigger, sortBy, userPosts]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use type assertion for the query to prevent TypeScript from trying to infer too deeply
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:profile_id (username, avatar_url),
          group:group_id (name),
          poll:poll_id (
            id,
            question,
            options:text,
            votes:poll_votes (id, poll_id, user_id, option_index)
          )
        `) as any;
      
      // Apply sorting
      if (sortBy === "newest") {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === "oldest") {
        query = query.order('created_at', { ascending: true });
      }

      // Apply group filter
      if (selectedGroup) {
        query = query.eq('group_id', selectedGroup);
      }

      // Apply user filter
      if (userPosts) {
        query = query.eq('user_id', userPosts);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        setPosts([]);
        return;
      }

      // Use a type assertion to avoid the excessive type instantiation
      const transformedPosts = transformPosts(data);
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  return { posts, isLoading, error, refetchPosts: fetchPosts };
};
