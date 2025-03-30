
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTab } from "./PostsTab";
import { BusinessesTab } from "./BusinessesTab";
import { ServicesTab } from "./ServicesTab";
import { LikedBusinessesTab } from "./LikedBusinessesTab";
import { SubscribedBusinessesTab } from "./SubscribedBusinessesTab";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProfileTabsProps {
  profileId?: string;
}

export const ProfileTabs = ({ profileId }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="posts" className="space-y-4 animate-fade-in">
      <div className="relative overflow-hidden rounded-md">
        <ScrollArea className="pb-1">
          <TabsList className="flex w-full min-w-fit">
            <TabsTrigger value="posts" className="animate-fade-in transition-all px-4 py-2">
              Posts
            </TabsTrigger>
            <TabsTrigger value="businesses" className="animate-fade-in transition-all px-4 py-2">
              Businesses
            </TabsTrigger>
            <TabsTrigger value="services" className="animate-fade-in transition-all px-4 py-2">
              Services
            </TabsTrigger>
            <TabsTrigger value="liked" className="animate-fade-in transition-all px-4 py-2">
              Liked
            </TabsTrigger>
            <TabsTrigger value="subscribed" className="animate-fade-in transition-all px-4 py-2">
              Subscribed
            </TabsTrigger>
          </TabsList>
        </ScrollArea>
      </div>
      
      <TabsContent value="posts" className="animate-scale-in">
        <PostsTab />
      </TabsContent>
      <TabsContent value="businesses" className="animate-scale-in">
        <BusinessesTab />
      </TabsContent>
      <TabsContent value="services" className="animate-scale-in">
        <ServicesTab />
      </TabsContent>
      <TabsContent value="liked" className="animate-scale-in">
        <LikedBusinessesTab />
      </TabsContent>
      <TabsContent value="subscribed" className="animate-scale-in">
        <SubscribedBusinessesTab />
      </TabsContent>
    </Tabs>
  );
};
