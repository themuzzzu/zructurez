
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTab } from "./PostsTab";
import { FollowersTab } from "./FollowersTab";
import { BusinessesTab } from "./BusinessesTab";
import { ServicesTab } from "./ServicesTab";
import { LikedBusinessesTab } from "./LikedBusinessesTab";
import { SubscribedBusinessesTab } from "./SubscribedBusinessesTab";
import { PricingSection } from "./PricingSection";
import { BadgeDollarSign } from "lucide-react";
import { BusinessRankings } from "@/components/rankings/BusinessRankings";

interface ProfileTabsProps {
  profileId?: string;
}

export const ProfileTabs = ({ profileId }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState("posts");
  const isOwnProfile = !profileId;

  return (
    <Tabs defaultValue="posts" onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 w-full">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="businesses">Businesses</TabsTrigger>
        <TabsTrigger value="followers">Followers</TabsTrigger>
        {isOwnProfile && (
          <>
            <TabsTrigger value="subscribed">Subscribed</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-1">
              <BadgeDollarSign className="h-4 w-4" />
              <span>Pricing</span>
            </TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="posts">
        <PostsTab profileId={profileId} />
      </TabsContent>

      <TabsContent value="services">
        <ServicesTab profileId={profileId} />
      </TabsContent>

      <TabsContent value="businesses">
        <BusinessesTab profileId={profileId} />
        
        {/* Add the BusinessRankings component */}
        {!profileId && <BusinessRankings />}
      </TabsContent>

      <TabsContent value="followers">
        <FollowersTab profileId={profileId} />
      </TabsContent>

      {isOwnProfile && (
        <>
          <TabsContent value="subscribed">
            <SubscribedBusinessesTab />
          </TabsContent>

          <TabsContent value="liked">
            <LikedBusinessesTab />
          </TabsContent>

          <TabsContent value="pricing">
            <PricingSection />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};
