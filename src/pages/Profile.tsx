import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { PostsTab } from "@/components/profile/PostsTab";
import { ServicesTab } from "@/components/profile/ServicesTab";
import { BusinessesTab } from "@/components/profile/BusinessesTab";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);

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
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={profile.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-2xl">{profile.username || "Anonymous"}</CardTitle>
                    <p className="text-muted-foreground mt-2">{profile.bio || "No bio yet"}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="businesses">Businesses</TabsTrigger>
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
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;