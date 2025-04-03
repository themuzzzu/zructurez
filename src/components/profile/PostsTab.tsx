
import React from "react";

interface PostsTabProps {
  profileId: string;
}

export const PostsTab: React.FC<PostsTabProps> = ({ profileId }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Posts</h3>
      <p className="text-muted-foreground">User posts will display here</p>
    </div>
  );
};
