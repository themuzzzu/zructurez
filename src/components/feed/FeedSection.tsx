
import { useFeed } from "@/hooks/useFeed";
import { PostCard } from "./PostCard";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { EmptyFeed } from "./EmptyFeed";
import { FeedError } from "./FeedError";

export const FeedSection = () => {
  const { posts, loading, error, refreshFeed } = useFeed();

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <FeedError onRetry={refreshFeed} />;
  }

  if (!posts || posts.length === 0) {
    return <EmptyFeed />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Latest Updates</h2>
        <Button variant="ghost" size="sm" onClick={refreshFeed} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          onRefresh={refreshFeed}
        />
      ))}
    </div>
  );
};
