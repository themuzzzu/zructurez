import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { ServiceCard } from "@/components/ServiceCard";
import { BusinessCard } from "@/components/BusinessCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: posts } = useQuery({
    queryKey: ['user-posts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:profile_id (username, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
  });

  const { data: services } = useQuery({
    queryKey: ['user-services'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
  });

  const { data: businesses } = useQuery({
    queryKey: ['user-businesses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
  });

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

              <TabsContent value="posts" className="space-y-4 mt-4">
                {posts?.map((post: any) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    author={post.profiles?.username || "Anonymous"}
                    avatar={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`}
                    time={new Date(post.created_at).toLocaleString()}
                    content={post.content}
                    category={post.category || "General"}
                    likes={post.likes}
                    comments={post.comments}
                    image={post.image_url}
                    isLiked={post.user_has_liked}
                  />
                ))}
              </TabsContent>

              <TabsContent value="services" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services?.map((service: any) => (
                    <ServiceCard key={service.id} {...service} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="businesses" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businesses?.map((business: any) => (
                    <BusinessCard key={business.id} {...business} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;