
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePostRepost = (postId: string) => {
  const queryClient = useQueryClient();

  const { data: hasReposted } = useQuery({
    queryKey: ['post-repost', postId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('reposts')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      return !!data;
    },
    initialData: false,
  });

  const { mutate: toggleRepost } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to repost');

      if (hasReposted) {
        const { error } = await supabase
          .from('reposts')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reposts')
          .insert([
            { post_id: postId, user_id: user.id }
          ]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-repost', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(hasReposted ? 'Post unreposted' : 'Post reposted');
    },
    onError: (error) => {
      console.error('Error toggling repost:', error);
      toast.error('Failed to update repost status');
    },
  });

  return { hasReposted, toggleRepost };
};
