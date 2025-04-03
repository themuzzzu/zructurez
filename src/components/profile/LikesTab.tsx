
import React from "react";

interface LikesTabProps {
  profileId: string;
}

export const LikesTab: React.FC<LikesTabProps> = ({ profileId }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Likes</h3>
      <p className="text-muted-foreground">Posts liked by this user will appear here</p>
    </div>
  );
};
