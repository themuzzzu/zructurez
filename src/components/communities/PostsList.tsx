
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

// Define a simplified type for the raw post data from Supabase
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
  group?: Record<string, any>; // Using a more flexible type
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

    // Safely type cast the data - first to unknown, then to our expected type
    const rawPosts = (data || []) as unknown as RawPostData[];
    
    // Transform the data to match our Post interface
    const transformedPosts: Post[] = rawPosts.map(post => {
      // Create a base post object with required fields
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
        group: { name: 'Unknown Group' } // Default fallback
      };

      // Handle group data if it exists
      if (post.group && typeof post.group === 'object') {
        if ('name' in post.group && typeof post.group.name === 'string') {
          transformedPost.group = { name: post.group.name };
        }
      }

      // Handle poll data if it exists
      if (post.poll && typeof post.poll === 'object') {
        const pollOptions = Array.isArray(post.poll.options) 
          ? post.poll.options.map((opt: any) => {
              if (typeof opt === 'string') {
                return { id: crypto.randomUUID(), text: opt };
              } else if (opt && typeof opt === 'object' && 'text' in opt) {
                return { 
                  id: ('id' in opt && opt.id) ? opt.id : crypto.randomUUID(), 
                  text: opt.text 
                };
              } else {
                return { id: crypto.randomUUID(), text: String(opt || '') };
              }
            })
          : [];

        transformedPost.poll = {
          id: post.poll.id,
          question: post.poll.question,
          options: pollOptions,
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
