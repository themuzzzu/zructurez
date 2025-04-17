
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FeedUser {
  id: string;
  username: string;
  avatar_url: string;
  name: string;
}

interface FeedItem {
  id: string;
  content: string;
  created_at: string;
  images?: string[];
  likes: number;
  comments: number;
  user: FeedUser;
  liked_by_user: boolean;
}

export const useFeed = (userId?: string) => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["feed", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feed_posts")
        .select(`
          id,
          content,
          created_at,
          images,
          likes,
          comments,
          user_id,
          profiles:user_id (id, username, avatar_url, name)
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Handle liked status
      let processedData = [];
      if (data && data.length > 0) {
        const likedPosts = userId ? await fetchLikedPosts(userId) : [];
        
        processedData = data.map((post) => ({
          id: post.id,
          content: post.content,
          created_at: post.created_at,
          images: post.images || [],
          likes: post.likes || 0,
          comments: post.comments || 0,
          user: {
            id: post.profiles.id,
            username: post.profiles.username,
            avatar_url: post.profiles.avatar_url,
            name: post.profiles.name
          },
          liked_by_user: likedPosts.includes(post.id)
        }));
      }
      
      return processedData;
    },
    enabled: true,
  });

  useEffect(() => {
    if (data) {
      setFeedItems(data);
    }
  }, [data]);

  const fetchLikedPosts = async (userId: string): Promise<string[]> => {
    try {
      const { data } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId);

      return data ? data.map((like) => like.post_id) : [];
    } catch (error) {
      console.error("Error fetching liked posts:", error);
      return [];
    }
  };

  const handleLikeToggle = async (postId: string) => {
    if (!userId) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      const updatedItems = feedItems.map((item) => {
        if (item.id === postId) {
          const newLikedStatus = !item.liked_by_user;
          const likeDelta = newLikedStatus ? 1 : -1;
          
          return {
            ...item,
            liked_by_user: newLikedStatus,
            likes: item.likes + likeDelta,
          };
        }
        return item;
      });
      
      setFeedItems(updatedItems);

      // Update in database
      const isLiked = updatedItems.find(item => item.id === postId)?.liked_by_user;
      
      if (isLiked) {
        await supabase.from("post_likes").insert({
          user_id: userId,
          post_id: postId,
        });
        
        await supabase.rpc('increment_post_likes', { post_id_input: postId });
      } else {
        await supabase.from("post_likes")
          .delete()
          .match({ user_id: userId, post_id: postId });
          
        await supabase.rpc('decrement_post_likes', { post_id_input: postId });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
      refetch();
    }
  };

  return {
    feedItems,
    isLoading,
    error,
    refetch,
    handleLikeToggle,
  };
};
