import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTab } from "./PostsTab";
import { BusinessesTab } from "./BusinessesTab";
import { ServicesTab } from "./ServicesTab";
import { LikedBusinessesTab } from "./LikedBusinessesTab";
import { SubscribedBusinessesTab } from "./SubscribedBusinessesTab";

export const ProfileTabs = () => {
  return (
    <Tabs defaultValue="posts" className="space-y-4">
      <TabsList>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="businesses">Businesses</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="liked">Liked</TabsTrigger>
        <TabsTrigger value="subscribed">Subscribed</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <PostsTab />
      </TabsContent>
      <TabsContent value="businesses">
        <BusinessesTab />
      </TabsContent>
      <TabsContent value="services">
        <ServicesTab />
      </TabsContent>
      <TabsContent value="liked">
        <LikedBusinessesTab />
      </TabsContent>
      <TabsContent value="subscribed">
        <SubscribedBusinessesTab />
      </TabsContent>
    </Tabs>
  );
};