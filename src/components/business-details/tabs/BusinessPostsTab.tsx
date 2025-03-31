
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Business, UserPost } from "@/types/business";

interface BusinessPostsTabProps {
  business: Business | string;
}

export const BusinessPostsTab = ({ business }: BusinessPostsTabProps) => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const businessId = typeof business === 'string' ? business : business.id;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching business posts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (businessId) {
      fetchPosts();
    }
  }, [businessId]);
  
  if (loading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </Card>
    );
  }
  
  if (posts.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p className="py-8 text-muted-foreground">No posts have been shared by this business yet.</p>
      </Card>
    );
  }
  
  return (
    <Card className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border-b pb-4">
            <p className="text-sm text-muted-foreground mb-2">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <p>{post.content}</p>
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt="Post" 
                className="mt-2 rounded-md max-h-[300px] object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
