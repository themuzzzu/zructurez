import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CreatePost } from "@/components/CreatePost";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { getPosts } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', selectedCategory],
    queryFn: getPosts,
  });

  const filteredPosts = selectedCategory
    ? posts?.filter(post => post.category === selectedCategory)
    : posts;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16 px-4">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block sticky top-24 h-[calc(100vh-6rem)]" />
          <main className="flex-1 max-w-2xl mx-auto lg:mx-0">
            <div className="space-y-6">
              <CreatePost />
              <CategoryFilter onCategorySelect={setSelectedCategory} />
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