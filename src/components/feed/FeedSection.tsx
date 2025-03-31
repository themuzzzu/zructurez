
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useFeed } from "@/hooks/useFeed";
import { PostCard } from "./PostCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { CreatePost } from "@/components/CreatePost";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const FeedSection = () => {
  const { user, loading: authLoading } = useAuth();
  const { posts, loading, error, refreshFeed } = useFeed();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshFeed();
    toast.success("Refreshing feed...");
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    // Auto-refresh feed on mount
    refreshFeed();
  }, []);

  if (authLoading) {
    return (
      <div className="py-4 text-center">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p className="text-muted-foreground">Loading your feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Feed</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh}
          disabled={refreshing}
          className={refreshing ? "animate-spin" : ""}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      {user ? (
        <CreatePost 
          onSuccess={() => {
            refreshFeed();
            toast.success("Post created successfully!");
          }} 
        />
      ) : (
        <Card className="p-4 text-center">
          <p>Sign in to create posts and interact with your community</p>
        </Card>
      )}

      {loading && !refreshing ? (
        <div className="py-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading posts...</p>
        </div>
      ) : error ? (
        <Card className="p-4 text-center">
          <p className="text-destructive">{error}</p>
          <Button 
            variant="outline" 
            onClick={refreshFeed} 
            className="mt-2"
          >
            Try Again
          </Button>
        </Card>
      ) : posts.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to post or follow some users to see their posts here
          </p>
        </Card>
      ) : (
        <div className="space-y-1">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onRefresh={refreshFeed} />
          ))}
        </div>
      )}
    </div>
  );
};
