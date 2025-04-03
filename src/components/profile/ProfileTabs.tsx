
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTab } from "./PostsTab";
import { MediaTab } from "./MediaTab";
import { LikesTab } from "./LikesTab";

interface ProfileTabsProps {
  profileId: string;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ profileId }) => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="likes">Likes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts">
        <PostsTab profileId={profileId} />
      </TabsContent>
      
      <TabsContent value="media">
        <MediaTab profileId={profileId} />
      </TabsContent>
      
      <TabsContent value="likes">
        <LikesTab profileId={profileId} />
      </TabsContent>
    </Tabs>
  );
};
