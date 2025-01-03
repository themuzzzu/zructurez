import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CreatePost } from "@/components/CreatePost";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { getPosts } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hash, MessageSquare, Users, Wrench } from "lucide-react";

const Index = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', selectedCategory],
    queryFn: getPosts,
  });

  const categories = [
    { name: "General", icon: Hash },
    { name: "Events", icon: MessageSquare },
    { name: "News", icon: MessageSquare },
    { name: "Questions", icon: MessageSquare },
    { name: "Recommendations", icon: MessageSquare },
    { name: "Lost & Found", icon: MessageSquare },
    { name: "Community", icon: Users },
    { name: "Services", icon: Wrench },
  ];

  const filteredPosts = selectedCategory
    ? posts?.filter(post => post.category?.toLowerCase() === selectedCategory.toLowerCase())
    : posts;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-16 px-4">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block sticky top-16 shrink-0" />
          <main className="flex-1 max-w-2xl mx-auto lg:mx-0">
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.name}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          const searchParams = new URLSearchParams(window.location.search);
                          searchParams.set('category', category.name.toLowerCase());
                          window.history.pushState(null, '', `?${searchParams.toString()}`);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {category.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <CreatePost />
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">Loading posts...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    Error loading posts. Please try again later.
                  </div>
                ) : filteredPosts?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No posts found. Be the first to post!
                  </div>
                ) : (
                  filteredPosts?.map((post) => (
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
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;