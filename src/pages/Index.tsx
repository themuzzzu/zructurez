import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CreatePost } from "@/components/CreatePost";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { getPosts } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LoadingView } from "@/components/LoadingView";
import { BusinessCard } from "@/components/BusinessCard";
import { supabase } from "@/integrations/supabase/client";

const PostList = ({ selectedCategory }: { selectedCategory: string | null }) => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', selectedCategory],
    queryFn: getPosts,
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return <LoadingView />;
  }

  const filteredPosts = selectedCategory
    ? posts?.filter(post => post.category?.toLowerCase() === selectedCategory.toLowerCase())
    : posts;

  if (!filteredPosts?.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        No posts found. Be the first to post!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
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
    </div>
  );
};

const BusinessSection = () => {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .limit(3);
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading || !businesses || businesses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 bg-black/90 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold text-white">Business Section</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {businesses.map((business) => (
          <BusinessCard
            key={business.id}
            id={business.id}
            name={business.name}
            category={business.category}
            description={business.description}
            image={business.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800"}
            rating={4.5}
            reviews={10}
            location={business.location || "Location not specified"}
            contact={business.contact || "Contact not available"}
            hours={business.hours || "Hours not specified"}
            verified={business.verified || false}
            serviceName="Featured Service"
            cost={0}
          />
        ))}
      </div>
    </div>
  );
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const categories = [
    "All",
    "General",
    "News",
    "Events",
    "Questions",
    "Recommendations",
    "Lost & Found",
    "Community",
  ];

  const handleCategorySelect = (category: string) => {
    if (category === "All") {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category.toLowerCase());
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar className="w-64 fixed left-0 top-0 pt-16" />
        <main className="flex-1 ml-64 pt-16 px-4 bg-background">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-background shadow-lg">
                <div className="flex space-x-2 p-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        selectedCategory === category.toLowerCase() || (!selectedCategory && category === "All")
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <CreatePost />
              <BusinessSection />
              <PostList selectedCategory={selectedCategory} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;