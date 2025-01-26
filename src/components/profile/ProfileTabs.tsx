import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTab } from "./PostsTab";
import { ServicesTab } from "./ServicesTab";
import { BusinessesTab } from "./BusinessesTab";
import { SubscribedBusinessesTab } from "./SubscribedBusinessesTab";

export const ProfileTabs = () => {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="businesses">Businesses</TabsTrigger>
        <TabsTrigger value="subscribed">Subscribed Businesses</TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        <PostsTab />
      </TabsContent>

      <TabsContent value="services">
        <ServicesTab />
      </TabsContent>

      <TabsContent value="businesses">
        <BusinessesTab />
      </TabsContent>

      <TabsContent value="subscribed">
        <SubscribedBusinessesTab />
      </TabsContent>
    </Tabs>
  );
};