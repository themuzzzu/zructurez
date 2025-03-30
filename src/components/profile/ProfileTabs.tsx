
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTab } from "./PostsTab";
import { BusinessesTab } from "./BusinessesTab";
import { ServicesTab } from "./ServicesTab";
import { LikedBusinessesTab } from "./LikedBusinessesTab";
import { SubscribedBusinessesTab } from "./SubscribedBusinessesTab";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ProfileTabsProps {
  profileId?: string;
}

export const ProfileTabs = ({ profileId }: ProfileTabsProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

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
            <TabsTrigger value="wishlist" className="animate-fade-in transition-all px-4 py-2">
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="reviews" className="animate-fade-in transition-all px-4 py-2">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="photos" className="animate-fade-in transition-all px-4 py-2">
              Photos
            </TabsTrigger>
          </TabsList>
        </ScrollArea>
      </div>
      
      <Card className="overflow-hidden">
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide">
          <TabsContent value="posts" className="p-4 animate-scale-in">
            <PostsTab profileId={profileId} />
          </TabsContent>
          
          <TabsContent value="businesses" className="p-4 animate-scale-in">
            <BusinessesTab />
          </TabsContent>
          
          <TabsContent value="services" className="p-4 animate-scale-in">
            <ServicesTab />
          </TabsContent>
          
          <TabsContent value="wishlist" className="p-4 animate-scale-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <LikedBusinessesTab />
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="p-4 animate-scale-in">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          </TabsContent>
          
          <TabsContent value="photos" className="p-4 animate-scale-in">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No photos yet</p>
            </div>
          </TabsContent>
        </div>
      </Card>
    </Tabs>
  );
};
