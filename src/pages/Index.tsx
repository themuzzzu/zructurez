
import { CreatePost } from "@/components/CreatePost";
import { EnhancedPostCard } from "@/components/EnhancedPostCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { HomeLayout } from "@/components/layout/HomeLayout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InstagramGrid } from "@/components/instagram/InstagramGrid";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("for-you");
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const { data: posts = [], isLoading, refetch } = useQuery({
    queryKey: ['posts', activeTab],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:profile_id (username, avatar_url),
          likes(id),
          comments(id)
        `)
        .order('created_at', { ascending: false });
      
      // If "Following" tab is active, filter for followed users
      if (activeTab === "following") {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get user's following list
          const { data: followingData } = await supabase
            .from('followers')
            .select('following_id')
            .eq('follower_id', user.id);
          
          if (followingData && followingData.length > 0) {
            const followingIds = followingData.map(f => f.following_id);
            query = query.in('profile_id', followingIds);
          } else {
            return []; // Return empty if not following anyone
          }
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data.map(post => ({
        ...post,
        likes: post.likes?.length || 0,
        comments: post.comments?.length || 0,
        isLiked: post.likes?.some((like: any) => like.user_id === user?.id) || false
      }));
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success("Feed refreshed");
    } catch (error) {
      toast.error("Failed to refresh feed");
    } finally {
      setRefreshing(false);
    }
  };

  const renderPostsList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (posts.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No posts yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            {activeTab === "for-you" 
              ? "Be the first to post something!" 
              : "Follow more people to see their posts here"}
          </p>
        </div>
      );
    }
    
    if (activeTab === "for-you") {
      return (
        posts.map((post) => (
          <div key={post.id} className="hover:bg-muted/50 transition-colors">
            <EnhancedPostCard
              id={post.id}
              author={post.profiles?.username || "Unknown"}
              avatar={post.profiles?.avatar_url || ""}
              time={post.created_at}
              content={post.content}
              category={post.category}
              image={post.image_url}
              likes={post.likes}
              comments={post.comments}
              views={post.views || 0}
              isLiked={post.isLiked}
            />
          </div>
        ))
      );
    } else {
      // Instagram-like grid for following tab
      return <InstagramGrid posts={posts} />;
    }
  };

  return (
    <HomeLayout>
      <Card className="overflow-hidden border-0 shadow-none rounded-none">
        <div className="sticky top-0 z-10 bg-background pt-2 pb-1 border-b">
          <div className="flex justify-between items-center mb-2 px-4">
            <h1 className="text-xl font-bold">Home</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="rounded-full hover:bg-primary/10"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="for-you" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                For You
              </TabsTrigger>
              <TabsTrigger value="following" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Following
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="for-you" className="mt-0">
              <div className="space-y-0 divide-y">
                {renderPostsList()}
              </div>
            </TabsContent>
            
            <TabsContent value="following" className="mt-0">
              {renderPostsList()}
            </TabsContent>
          </Tabs>
        </div>

        <div className="px-4 py-3">
          <CreatePost />
        </div>
        
        <Separator />
      </Card>
    </HomeLayout>
  );
};

export default Index;
