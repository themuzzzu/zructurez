
import React from "react";

interface MediaTabProps {
  profileId: string;
}

export const MediaTab: React.FC<MediaTabProps> = ({ profileId }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Media</h3>
      <p className="text-muted-foreground">User media will display here</p>
    </div>
  );
};
