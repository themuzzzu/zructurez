
import React from "react";
import { Card } from "@/components/ui/card";
import { FeedItem } from "@/types/feed";
import { FeedItemComponent } from "./FeedItemComponent";
import { FeedSkeleton } from "./FeedSkeleton";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

export const FeedSection = ({ feedItems, isLoading, error, refetch, handleLikeToggle }) => {
  if (isLoading) {
    return <FeedSkeleton count={3} />;
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground mb-4">
          Failed to load feed. Please try again.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </Card>
    );
  }

  if (feedItems.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          No posts to show yet. Follow businesses and users to see their posts here!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Feed</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => refetch()}
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {feedItems.map((item) => (
        <FeedItemComponent
          key={item.id}
          item={item}
          onLikeToggle={handleLikeToggle}
        />
      ))}
    </div>
  );
};
