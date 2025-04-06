
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const useBusinessLikes = (businessId: string) => {
  const queryClient = useQueryClient();
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);

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

      console.log(`Business ${businessId} liked status:`, !!data);
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

      // Get current state before optimistic update
      const currentLiked = optimisticLiked !== null ? optimisticLiked : !!isLiked;
      const currentCount = optimisticCount !== null ? optimisticCount : likesCount;

      // Apply optimistic update
      setOptimisticLiked(!currentLiked);
      setOptimisticCount(currentLiked ? Math.max(0, currentCount - 1) : currentCount + 1);

      console.log(`[Business Like] Toggling like for ${businessId} from ${currentLiked} to ${!currentLiked}`);

      try {
        if (currentLiked) {
          const { error } = await supabase
            .from('business_likes')
            .delete()
            .eq('business_id', businessId)
            .eq('user_id', user.id);

          if (error) {
            console.error("Error unlinking business:", error);
            throw error;
          }
        } else {
          const { error } = await supabase
            .from('business_likes')
            .insert([
              { business_id: businessId, user_id: user.id }
            ]);

          if (error) {
            console.error("Error liking business:", error);
            throw error;
          }
        }
        
        return { success: true, now_liked: !currentLiked };
      } catch (error) {
        // Revert optimistic updates on error
        setOptimisticLiked(currentLiked);
        setOptimisticCount(currentCount);
        throw error;
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['business-like', businessId] });
      queryClient.invalidateQueries({ queryKey: ['business-likes-count', businessId] });
      queryClient.invalidateQueries({ queryKey: ['user-liked-businesses'] });
      
      // We need to access the new liked state from the result
      const liked = result.now_liked;
      toast.success(liked ? 'Business liked' : 'Business unliked');
      
      // Reset optimistic values after successful update, but with a delay
      // to prevent UI flicker
      setTimeout(() => {
        setOptimisticLiked(null);
        setOptimisticCount(null);
      }, 1000);
    },
    onError: (error) => {
      console.error('Error:', error);
      if ((error as Error).message !== 'Must be logged in to like businesses') {
        toast.error('Failed to update like status');
      }
    }
  });

  const isLoading = isLikeLoading || isCountLoading || isTogglePending;
  const finalIsLiked = optimisticLiked !== null ? optimisticLiked : !!isLiked;
  const finalLikesCount = optimisticCount !== null ? optimisticCount : likesCount;

  // Debug logging
  useEffect(() => {
    console.log(`[Business ${businessId}] Like status: ${finalIsLiked}, Count: ${finalLikesCount}`);
  }, [businessId, finalIsLiked, finalLikesCount]);

  return {
    isLiked: finalIsLiked,
    likesCount: finalLikesCount,
    toggleLike,
    isLoading
  };
};
