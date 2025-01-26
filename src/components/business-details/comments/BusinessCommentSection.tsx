import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { toast } from "sonner";

interface BusinessCommentSectionProps {
  businessId: string;
}

export const BusinessCommentSection = ({ businessId }: BusinessCommentSectionProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: isBusinessOwner } = useQuery({
    queryKey: ['is-business-owner', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: business } = await supabase
        .from('businesses')
        .select('user_id')
        .eq('id', businessId)
        .single();

      return business?.user_id === user.id;
    }
  });

  const { data: comments, isLoading } = useQuery({
    queryKey: ['business-comments', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_comments')
        .select(`
          *,
          profile:profiles!business_comments_profile_id_fkey (
            username,
            avatar_url
          ),
          replies:business_comments (
            *,
            profile:profiles!business_comments_profile_id_fkey (
              username,
              avatar_url
            )
          )
        `)
        .eq('business_id', businessId)
        .is('reply_to', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: async ({ content, rating }: { content: string; rating: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to comment");

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { error } = await supabase
        .from('business_comments')
        .insert({
          business_id: businessId,
          user_id: user.id,
          profile_id: profile.id,
          content,
          rating: rating || null,
          reply_to: null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-comments', businessId] });
      toast.success("Comment posted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to post comment. Please try again.");
      console.error("Error posting comment:", error);
    }
  });

  const { mutate: submitReply } = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to reply");

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { error } = await supabase
        .from('business_comments')
        .insert({
          business_id: businessId,
          user_id: user.id,
          profile_id: profile.id,
          content,
          reply_to: replyingTo
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-comments', businessId] });
      setReplyingTo(null);
      toast.success("Reply posted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to post reply. Please try again.");
      console.error("Error posting reply:", error);
    }
  });

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">Comments & Reviews</h3>
      
      <CommentForm
        onSubmit={(content, rating) => submitComment({ content, rating })}
        isPending={isPending}
      />

      <div className="space-y-6">
        {isLoading ? (
          <p>Loading comments...</p>
        ) : comments?.length === 0 ? (
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments?.map((comment: any) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isBusinessOwner={isBusinessOwner}
              replyingTo={replyingTo}
              onReplyClick={setReplyingTo}
              onReplySubmit={submitReply}
              onReplyCancel={() => setReplyingTo(null)}
            />
          ))
        )}
      </div>
    </Card>
  );
};