
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CreatePost } from "@/components/CreatePost";
import { GroupManagement } from "@/components/groups/GroupManagement";
import { FollowSuggestions } from "@/components/follow/FollowSuggestions";
import { PostCard } from "@/components/PostCard";
import { SponsoredPosts } from "@/components/SponsoredPosts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Index = () => {
  const [followSectionPosition, setFollowSectionPosition] = useState<number>(0);
  const [sponsoredPosition, setSponsoredPosition] = useState<number>(2);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:profile_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    // Randomly position the follow section between posts
    if (posts.length > 0) {
      const randomPosition = Math.floor(Math.random() * (posts.length + 1));
      setFollowSectionPosition(randomPosition);
      
      // Position sponsored posts at a different position
      let sponsoredPos = Math.floor(Math.random() * (posts.length + 1));
      // Make sure sponsored and follow sections are not at the same position
      while (sponsoredPos === randomPosition) {
        sponsoredPos = Math.floor(Math.random() * (posts.length + 1));
      }
      setSponsoredPosition(sponsoredPos);
    }
  }, [posts]);

  const renderContent = () => {
    const content: JSX.Element[] = [];

    posts.forEach((post, index) => {
      if (index === followSectionPosition) {
        content.push(<FollowSuggestions key="follow-suggestions" />);
      }
      
      if (index === sponsoredPosition) {
        content.push(<SponsoredPosts key="sponsored-posts" />);
      }
      
      content.push(
        <PostCard
          key={post.id}
          id={post.id}
          author={post.profiles?.username || "Unknown"}
          avatar={post.profiles?.avatar_url || ""}
          time={new Date(post.created_at).toLocaleDateString()}
          content={post.content}
          category={post.category}
          image={post.image_url}
          likes={0}
          comments={0}
          views={post.views || 0}
        />
      );
    });

    // If the random positions are at the end, append them
    if (followSectionPosition === posts.length) {
      content.push(<FollowSuggestions key="follow-suggestions" />);
    }
    
    if (sponsoredPosition === posts.length) {
      content.push(<SponsoredPosts key="sponsored-posts" />);
    }

    return content;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="flex">
          <Sidebar className="hidden lg:block w-64 fixed h-[calc(100vh-4rem)]" />
          <main className="flex-1 lg:ml-64">
            <div className="container max-w-[800px] p-4 space-y-4">
              <CreatePost />
              <div className="space-y-4">
                {isLoading ? (
                  <div>Loading posts...</div>
                ) : (
                  renderContent()
                )}
              </div>
              <div className="my-8">
                <h2 className="text-2xl font-bold mb-4">Groups</h2>
                <GroupManagement />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
