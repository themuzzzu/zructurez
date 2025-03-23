
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "../types/postTypes";
import { transformPosts } from "../utils/postTransformUtils";

export const usePostsData = (selectedGroup: string | null, refreshTrigger: number) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [selectedGroup, refreshTrigger]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
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
        `)
        .order('created_at', { ascending: false });

      if (selectedGroup) {
        query = query.eq('group_id', selectedGroup);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        setPosts([]);
        return;
      }

      // Fix for excessive type instantiation by using an explicit type cast
      const transformedPosts = transformPosts(data as any[]);
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
