
import { CreatePost } from "@/components/CreatePost";
import { EnhancedPostCard } from "@/components/EnhancedPostCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { HomeLayout } from "@/components/layout/HomeLayout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("for-you");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', activeTab],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:profile_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      // If "Following" tab is active, filter for followed users
      // This is just a placeholder - actual implementation would filter by followed users
      if (activeTab === "following") {
        // In a real implementation, you'd filter by followed users
        // For now, we'll just limit to fewer posts for demonstration
        query = query.limit(3);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });

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
            likes={0}
            comments={0}
            views={post.views || 0}
          />
        </div>
      ))
    );
  };

  return (
    <HomeLayout>
      <Card className="p-0 overflow-hidden border-0 shadow-none">
        <div className="sticky top-0 z-10 bg-background pt-2 pb-1 px-4 border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="for-you">For You</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
          
            <TabsContent value="for-you" className="m-0">
              <div className="space-y-0 divide-y">
                {renderPostsList()}
              </div>
            </TabsContent>
            
            <TabsContent value="following" className="m-0">
              <div className="space-y-0 divide-y">
                {renderPostsList()}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4">
          <CreatePost />
        </div>
        
        <Separator />
      </Card>
    </HomeLayout>
  );
};

export default Index;
