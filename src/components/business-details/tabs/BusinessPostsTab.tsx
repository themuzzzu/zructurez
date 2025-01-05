import { Card } from "@/components/ui/card";
import { PostCard } from "@/components/PostCard";
import type { Business } from "@/types/business";

interface BusinessPostsTabProps {
  business: Business;
}

export const BusinessPostsTab = ({ business }: BusinessPostsTabProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      <div className="space-y-4">
        {business.posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            author={business.name}
            avatar={business.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${business.id}`}
            time={new Date(post.created_at).toLocaleDateString()}
            content={post.content}
            category={post.category}
            image={post.image_url}
            likes={0}
            comments={0}
          />
        ))}
      </div>
    </Card>
  );
};