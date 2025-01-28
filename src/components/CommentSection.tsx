import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CommentForm } from "./comments/CommentForm";
import { CommentList } from "./comments/CommentList";
import { toast } from "sonner";

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const queryClient = useQueryClient();

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to comment");

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          profile_id: profile.id,
          content
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success("Comment posted successfully!");
    },
    onError: (error) => {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    }
  });

  return (
    <div className="space-y-4 mt-4">
      <CommentForm 
        onSubmit={(content) => submitComment({ content })} 
        isPending={isPending} 
      />
      <div className="space-y-4 mt-6">
        <CommentList postId={postId} />
      </div>
    </div>
  );
};