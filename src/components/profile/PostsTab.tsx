
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedPostCard } from "@/components/EnhancedPostCard";
import { CreatePost } from "@/components/CreatePost";

interface PostsTabProps {
  profileId?: string;
}

export const PostsTab = ({ profileId }: PostsTabProps) => {
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const isCurrentUserProfile = !profileId || (currentUser && currentUser.id === profileId);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['profile-posts', profileId || currentUser?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('profile_id', profileId || currentUser?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profileId || !!currentUser?.id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="space-y-6">
        {isCurrentUserProfile && <CreatePost onSuccess={() => window.location.reload()} />}
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts yet</p>
          {isCurrentUserProfile && (
            <Button variant="outline" className="mt-4">Create your first post</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isCurrentUserProfile && <CreatePost onSuccess={() => window.location.reload()} />}
      {posts.map((post) => (
        <EnhancedPostCard
          key={post.id}
          id={post.id}
          author="User"
          avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          time={new Date(post.created_at).toISOString()}
          content={post.content}
          image={post.image_url}
          likes={0}
          comments={0}
          views={0}
          isLiked={false}
        />
      ))}
    </div>
  );
};
