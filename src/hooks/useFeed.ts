
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserPost } from "@/types/post";

export const useFeed = () => {
  return useQuery({
    queryKey: ['feed'],
    queryFn: async (): Promise<UserPost[]> => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!inner(id, username, avatar_url, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return posts?.map(post => ({
        id: post.id,
        user_id: post.user_id,
        profile_id: post.profile_id,
        business_id: post.business_id || undefined,
        content: post.content,
        image_url: post.image_url,
        created_at: post.created_at,
        category: post.category,
        likes_count: 0,
        comments_count: 0,
        reposts_count: 0,
        profile: {
          id: post.profiles.id,
          username: post.profiles.username,
          avatar_url: post.profiles.avatar_url,
          full_name: post.profiles.full_name,
        }
      })) || [];
    },
  });
};
