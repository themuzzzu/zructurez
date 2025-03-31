
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { HomeLayout } from "@/components/layout/HomeLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostsData } from "@/components/communities/hooks/usePostsData";
import { Avatar } from "@/components/ui/avatar";
import { MoreHorizontal, RefreshCw, MessageCircle, Heart, Share2, Image as ImageIcon } from "lucide-react";
import { CreatePost } from "@/components/CreatePost";
import { PostItem } from "@/components/communities/PostItem"; 
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("for-you");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const { posts, isLoading } = usePostsData(null, refreshTrigger);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    };
    getUser();
  }, []);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.info("Refreshing your feed...");
  };

  const handleLike = (postId: string) => {
    toast.success("Post liked!");
  };

  const handleComment = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handleShare = (postId: string) => {
    toast.success("Share link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="w-full">
        <HomeLayout>
          <div className="py-4 mobile-container px-4 sm:px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Home</h2>
              <Button 
                onClick={handleRefresh} 
                variant="ghost" 
                size="icon"
                className="hover:bg-muted transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>

            <CreatePost onSuccess={() => {
              setRefreshTrigger(prev => prev + 1);
              toast.success("Post created successfully!");
            }} />

            <Tabs defaultValue="for-you" className="w-full mt-4">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger 
                  value="for-you" 
                  onClick={() => setActiveTab("for-you")}
                  className={activeTab === "for-you" ? "data-[state=active]:bg-blue-500 data-[state=active]:text-white" : ""}
                >
                  For You
                </TabsTrigger>
                <TabsTrigger 
                  value="following" 
                  onClick={() => setActiveTab("following")}
                  className={activeTab === "following" ? "data-[state=active]:bg-blue-500 data-[state=active]:text-white" : ""}
                >
                  Following
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="for-you" className="mt-0 space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <PostItem key={post.id} post={post} onVote={() => setRefreshTrigger(prev => prev + 1)} />
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first post or follow some users</p>
                    
                    <div className="mt-8 flex justify-center">
                      <Button 
                        onClick={() => navigate("/businesses")} 
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Browse Business Listings
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="following" className="mt-0">
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Follow businesses and people to see their updates here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </HomeLayout>
      </main>
    </div>
  );
}
