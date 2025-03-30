
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { HomeLayout } from "@/components/layout/HomeLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostsData } from "@/components/communities/hooks/usePostsData";
import { Avatar } from "@/components/ui/avatar";
import { MoreHorizontal, RefreshCw, MessageCircle, Heart, Share2 } from "lucide-react";
import { CreatePost } from "@/components/CreatePost";
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
          <div className="py-4 mobile-container">
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
                    <div key={post.id} className="border border-border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <img 
                              src={post.profile?.avatar_url || "/placeholder.svg"} 
                              alt={post.profile?.username || "User"} 
                              loading="lazy"
                            />
                          </Avatar>
                          <div>
                            <div className="font-medium">{post.profile?.username || "Anonymous"}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(post.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </div>
                      <div>{post.content}</div>
                      {post.image_url && (
                        <div className="rounded-md overflow-hidden mt-2">
                          <img 
                            src={post.image_url} 
                            alt="Post image" 
                            className="w-full object-cover max-h-[400px]"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart className="h-4 w-4" />
                          <span>Like</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                          onClick={() => handleComment(post.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Comment</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                          onClick={() => handleShare(post.id)}
                        >
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </Button>
                      </div>
                    </div>
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
