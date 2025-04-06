
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBusinessLikes = (businessId: string) => {
  const queryClient = useQueryClient();

  const { data: isLiked, isLoading: isLikeLoading } = useQuery({
    queryKey: ['business-like', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('business_likes')
        .select('id')
        .eq('business_id', businessId)
        .eq('user_id', user.id)
        .maybeSingle();

      return !!data;
    }
  });

  const { data: likesCount = 0, isLoading: isCountLoading } = useQuery({
    queryKey: ['business-likes-count', businessId],
    queryFn: async () => {
      const { count } = await supabase
        .from('business_likes')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId);
      
      return count || 0;
    }
  });

  const { mutate: toggleLike, isPending: isTogglePending } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to like businesses", {
          action: {
            label: "Sign In",
            onClick: () => window.location.href = '/auth?redirect=/businesses'
          },
        });
        throw new Error('Must be logged in to like businesses');
      }

      if (isLiked) {
        const { error } = await supabase
          .from('business_likes')
          .delete()
          .eq('business_id', businessId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('business_likes')
          .insert([
            { business_id: businessId, user_id: user.id }
          ]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-like', businessId] });
      queryClient.invalidateQueries({ queryKey: ['business-likes-count', businessId] });
      toast.success(isLiked ? 'Business unliked' : 'Business liked');
    },
    onError: (error) => {
      console.error('Error:', error);
      if ((error as Error).message !== 'Must be logged in to like businesses') {
        toast.error('Failed to update like status');
      }
    }
  });

  const isLoading = isLikeLoading || isCountLoading || isTogglePending;

  return {
    isLiked: !!isLiked,
    likesCount,
    toggleLike,
    isLoading
  };
};
