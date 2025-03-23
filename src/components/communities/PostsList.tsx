
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import { PostItem } from "./PostItem";
import { usePostsData } from "./hooks/usePostsData";
import { Post } from "./types/postTypes";

interface PostsListProps {
  selectedGroup: string | null;
  refreshTrigger: number;
}

export const PostsList = ({ selectedGroup, refreshTrigger }: PostsListProps) => {
  const { posts, isLoading, error, refetchPosts } = usePostsData(selectedGroup, refreshTrigger);

  // Re-export types from types/postTypes.ts for backwards compatibility
  // This ensures existing imports don't break
  type PollOption = import("./types/postTypes").PollOption;
  type PollVote = import("./types/postTypes").PollVote;
  type Poll = import("./types/postTypes").Poll;
  type Post = import("./types/postTypes").Post;
  
  // Export the types to maintain backward compatibility
  export type { PollOption, PollVote, Poll, Post };

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Loading posts...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <Info className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-medium mb-2">Error loading posts</h3>
        <p className="text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No posts yet</h3>
        <p className="text-muted-foreground mb-4">
          Be the first to post in this community!
        </p>
        {!selectedGroup && (
          <p className="text-sm text-muted-foreground">
            Select a community to post in
          </p>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem 
          key={post.id} 
          post={post} 
          onVote={refetchPosts}
        />
      ))}
    </div>
  );
};
