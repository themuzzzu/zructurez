
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostItem } from "./PostItem";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export interface PollOption {
  id: string;
  text: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_index: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  votes: PollVote[];
}

export interface Post {
  id: string;
  user_id: string;
  group_id: string;
  content: string;
  created_at: string;
  image_url?: string | null;
  poll_id?: string | null;
  gif_url?: string | null;
  profile?: {
    username: string;
    avatar_url: string;
  };
  group?: {
    name: string;
  };
  poll?: Poll;
}

// Define a type for the raw post data we get from Supabase
// Using a more generic type to avoid strict type checking on the response
interface RawPostData {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  image_url?: string | null;
  gif_url?: string | null;
  poll_id?: string | null;
  business_id?: string | null;
  group_id?: string | null;
  profiles?: {
    username: string;
    avatar_url: string;
  } | null;
  group?: any; // Use a more flexible type for now
  poll?: {
    id: string;
    question: string;
    options: any[];
    votes: any[];
  } | null;
}

interface PostsListProps {
  selectedGroup: string | null;
  refreshTrigger: number;
}

export const PostsList = ({ selectedGroup, refreshTrigger }: PostsListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, [selectedGroup, refreshTrigger]);

  const fetchPosts = async () => {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:profile_id (username, avatar_url),
        group:group_id (name),
        poll:poll_id (
          id,
          question,
          options:text,
          votes:poll_votes (id, poll_id, user_id, option_index)
        )
      `)
      .order('created_at', { ascending: false });

    if (selectedGroup) {
      query = query.eq('group_id', selectedGroup);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    // Transform the data to match our Post interface
    // First cast to unknown to bypass type checking, then to our array type
    const rawData = data as unknown as RawPostData[];
    
    const transformedPosts: Post[] = (rawData || []).map(post => {
      // Create a properly typed Post object
      const transformedPost: Post = {
        id: post.id,
        user_id: post.user_id,
        group_id: post.group_id || post.business_id || '', // Handle either field name
        content: post.content,
        created_at: post.created_at,
        image_url: post.image_url,
        poll_id: post.poll_id,
        gif_url: post.gif_url,
        profile: post.profiles || undefined,
      };

      // Handle group data, ensuring it has the expected structure
      if (post.group && typeof post.group === 'object') {
        // If it's an object with a name property, use it
        if ('name' in post.group) {
          transformedPost.group = { name: post.group.name };
        } else {
          // Default fallback
          transformedPost.group = { name: 'Unknown Group' };
        }
      } else {
        transformedPost.group = { name: 'Unknown Group' };
      }

      // Handle poll data, ensuring it has the expected structure
      if (post.poll && typeof post.poll === 'object') {
        transformedPost.poll = {
          id: post.poll.id,
          question: post.poll.question,
          options: Array.isArray(post.poll.options) 
            ? post.poll.options.map((opt: any) => {
                // Convert each option to the expected structure
                return typeof opt === 'string' 
                  ? { id: crypto.randomUUID(), text: opt }
                  : (opt.text ? { id: opt.id || crypto.randomUUID(), text: opt.text } : { id: crypto.randomUUID(), text: String(opt) });
              })
            : [],
          votes: Array.isArray(post.poll.votes) ? post.poll.votes : []
        };
      }

      return transformedPost;
    });

    setPosts(transformedPosts);
  };

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No posts yet</h3>
        <p className="text-muted-foreground mb-4">
          Be the first to post in this community!
        </p>
        {!selectedGroup && (
          <p className="text-sm text-muted-foreground">
            Select a community to post in
          </p>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem 
          key={post.id} 
          post={post} 
          onVote={fetchPosts}
        />
      ))}
    </div>
  );
};
