import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { PostsTab } from "@/components/profile/PostsTab";
import { ServicesTab } from "@/components/profile/ServicesTab";
import { BusinessesTab } from "@/components/profile/BusinessesTab";
import { SubscribedBusinessesTab } from "@/components/profile/SubscribedBusinessesTab";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16 px-4">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block sticky top-24 h-[calc(100vh-6rem)]" />
          <main className="flex-1">
            <Card className="mb-6">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                      alt="Profile"
                      className="w-20 h-20 rounded-full"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{profile.name || "Anonymous"}</h1>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setIsEditing(!isEditing)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground">@{profile.username || "username"}</p>
                      <p className="text-muted-foreground">{profile.bio || "No bio yet"}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="businesses">Businesses</TabsTrigger>
                <TabsTrigger value="subscribed">Subscribed Businesses</TabsTrigger>
              </TabsList>

              <TabsContent value="posts">
                <div className="flex justify-end mb-4">
                  <Button variant="default">Create Post</Button>
                </div>
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;