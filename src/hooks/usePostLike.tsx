
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePostLike = (id: string, initialLikeStatus: boolean = false) => {
  const queryClient = useQueryClient();

  const { data: currentLikeStatus, isLoading: isLikeStatusLoading } = useQuery({
    queryKey: ['post-like', id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      return !!data;
    },
    initialData: initialLikeStatus,
  });

  const { mutate: toggleLike, isPending: isTogglePending } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to like posts');

      if (currentLikeStatus) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([
            { post_id: id, user_id: user.id }
          ]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-like', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(currentLikeStatus ? 'Post unliked' : 'Post liked');
    },
    onError: (error) => {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    },
  });

  return { 
    currentLikeStatus, 
    toggleLike,
    isLoading: isLikeStatusLoading || isTogglePending
  };
};
