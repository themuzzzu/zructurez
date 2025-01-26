import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Star, Reply } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface BusinessCommentSectionProps {
  businessId: string;
}

export const BusinessCommentSection = ({ businessId }: BusinessCommentSectionProps) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const queryClient = useQueryClient();

  // Check if current user is business owner
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
    mutationFn: async () => {
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
          content: comment,
          rating: rating || null,
          reply_to: null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-comments', businessId] });
      setComment("");
      setRating(0);
      toast.success("Comment posted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to post comment. Please try again.");
      console.error("Error posting comment:", error);
    }
  });

  const { mutate: submitReply } = useMutation({
    mutationFn: async () => {
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
          content: replyContent,
          reply_to: replyingTo
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-comments', businessId] });
      setReplyContent("");
      setReplyingTo(null);
      toast.success("Reply posted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to post reply. Please try again.");
      console.error("Error posting reply:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    submitComment();
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    submitReply();
  };

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">Comments & Reviews</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={isPending || !comment.trim()}>
          {isPending ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <div className="space-y-6">
        {isLoading ? (
          <p>Loading comments...</p>
        ) : comments?.length === 0 ? (
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments?.map((comment: any) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex gap-4 p-4 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <img
                    src={comment.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`}
                    alt={comment.profile?.username || "User"}
                  />
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {comment.profile?.username || "Anonymous"}
                    </span>
                    {comment.rating && (
                      <div className="flex items-center">
                        {Array.from({ length: comment.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground">{comment.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    {isBusinessOwner && !comment.reply_to && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(comment.id)}
                        className="flex items-center gap-2"
                      >
                        <Reply className="h-4 w-4" />
                        Reply
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Show reply form for business owner */}
              {isBusinessOwner && replyingTo === comment.id && (
                <div className="ml-12 space-y-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyContent.trim()}
                    >
                      Post Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Show replies */}
              {comment.replies?.map((reply: any) => (
                <div key={reply.id} className="ml-12 flex gap-4 p-4 border rounded-lg bg-muted/50">
                  <Avatar className="h-8 w-8">
                    <img
                      src={reply.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user_id}`}
                      alt={reply.profile?.username || "User"}
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {reply.profile?.username || "Anonymous"}
                      </span>
                      <Badge variant="outline">Business Owner</Badge>
                    </div>
                    <p className="text-muted-foreground">{reply.content}</p>
                    <span className="text-sm text-muted-foreground">
                      {new Date(reply.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};