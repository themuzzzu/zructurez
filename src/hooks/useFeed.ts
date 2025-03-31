
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPost } from "@/types/business";

// Mock data for demo posts
const DEMO_POSTS: UserPost[] = [
  {
    id: "demo-1",
    user_id: "demo-user-1",
    content: "Just launched our new collection of handmade jewelry! Check it out at our store. #smallbusiness #handmade",
    image_url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    likes_count: 42,
    comments_count: 7,
    reposts_count: 3,
    profile: {
      username: "ArtisanCreations",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user-1"
    }
  },
  {
    id: "demo-2",
    user_id: "demo-user-2",
    content: "Our weekend flash sale is now live! Get 30% off on all electronics until Sunday. Use code FLASH30 at checkout. #deals #electronics",
    image_url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1901&auto=format&fit=crop&ixlib=rb-4.0.3",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    likes_count: 28,
    comments_count: 5,
    reposts_count: 12,
    profile: {
      username: "TechDeals",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user-2"
    }
  },
  {
    id: "demo-3",
    user_id: "demo-user-3",
    content: "Just restocked our organic fresh produce section! Come visit us at the farmers market this weekend. #organic #local #farmersmarket",
    image_url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    created_at: new Date(Date.now() - 10800000).toISOString(),
    likes_count: 53,
    comments_count: 8,
    reposts_count: 6,
    profile: {
      username: "OrganicHarvest",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user-3"
    }
  },
  {
    id: "demo-4",
    user_id: "demo-user-4",
    content: "Our new fitness center is now open for membership! Get a free 7-day trial when you sign up this month. #fitness #wellness #newyearnewme",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    created_at: new Date(Date.now() - 14400000).toISOString(),
    likes_count: 76,
    comments_count: 12,
    reposts_count: 9,
    profile: {
      username: "FitLife",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user-4"
    }
  }
];

export const useFeed = () => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // First add demo posts to ensure there's always content
      let feedPosts: UserPost[] = [...DEMO_POSTS];
      
      // If user is logged in, add their personal posts
      if (user) {
        // Fetch posts from the database
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:profile_id (username, avatar_url),
            likes:likes(id),
            comments:comments(id)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data
        if (data && data.length > 0) {
          const transformedPosts: UserPost[] = data.map((post: any) => ({
            id: post.id,
            user_id: post.user_id,
            content: post.content,
            image_url: post.image_url,
            created_at: post.created_at,
            likes_count: post.likes?.length || 0,
            comments_count: post.comments?.length || 0,
            reposts_count: 0,
            profile: post.profiles || {
              username: "Anonymous",
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`
            }
          }));
          
          // Add user's real posts and sort by timestamp
          feedPosts = [...feedPosts, ...transformedPosts].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
      }

      setPosts(feedPosts);
    } catch (err: any) {
      console.error("Error fetching feed:", err);
      setError(err.message || "Failed to load feed");
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [refreshTrigger]);

  const refreshFeed = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { posts, loading, error, refreshFeed };
};
