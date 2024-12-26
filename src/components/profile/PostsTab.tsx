import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreatePost } from "@/components/CreatePost";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PostsTab = () => {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  const { data: posts, refetch: refetchPosts } = useQuery({
    queryKey: ['user-posts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:profile_id (username, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
  });

  const handlePostSuccess = () => {
    setIsPostDialogOpen(false);
    refetchPosts();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsPostDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>
      {posts?.map((post: any) => (
        <PostCard
          key={post.id}
          id={post.id}
          author={post.profiles?.username || "Anonymous"}
          avatar={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`}
          time={new Date(post.created_at).toLocaleString()}
          content={post.content}
          category={post.category || "General"}
          likes={post.likes}
          comments={post.comments}
          image={post.image_url}
          isLiked={post.user_has_liked}
        />
      ))}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <CreatePost onSuccess={handlePostSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};