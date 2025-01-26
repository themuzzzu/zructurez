import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BusinessActionButtonsProps {
  businessId: string;
}

export const BusinessActionButtons = ({ businessId }: BusinessActionButtonsProps) => {
  const queryClient = useQueryClient();

  const { data: isLiked } = useQuery({
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

  const { data: likesCount = 0 } = useQuery({
    queryKey: ['business-likes-count', businessId],
    queryFn: async () => {
      const { count } = await supabase
        .from('business_likes')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId);
      
      return count || 0;
    }
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
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
      toast.error('Failed to update like status');
    }
  });

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
        onClick={() => toggleLike()}
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        <span>{likesCount}</span>
      </Button>
    </div>
  );
};