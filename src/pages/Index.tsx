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
    <div className="min-h-screen bg-[#141419]">
      <Navbar />
      <div className="flex">
        <Sidebar className="w-64 fixed left-0 top-0 pt-16 bg-[#141419]" />
        <main className="flex-1 ml-64 pt-16 px-4 bg-[#141419]">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <ScrollArea className="w-full whitespace-nowrap rounded-md bg-[#1A1F2C] shadow-lg">
                <div className="flex space-x-2 p-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        selectedCategory === category.toLowerCase() || (!selectedCategory && category === "All")
                          ? "bg-primary text-white shadow-lg"
                          : "bg-[#222632] text-gray-300 hover:bg-[#272B38] hover:text-white"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <CreatePost />
              <PostList selectedCategory={selectedCategory} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
