
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

    if (!data || data.length === 0) {
      setPosts([]);
      return;
    }

    // Transform the raw data to match our Post interface
    try {
      const transformedPosts: Post[] = [];
      
      for (const rawPost of data) {
        // Use type assertion to handle the any type from Supabase
        const post: Post = {
          id: rawPost.id,
          user_id: rawPost.user_id,
          // Use the appropriate ID field (either group_id or business_id)
          group_id: rawPost.group_id || rawPost.business_id || '',
          content: rawPost.content,
          created_at: rawPost.created_at,
          image_url: rawPost.image_url || null,
          poll_id: rawPost.poll_id || null,
          gif_url: rawPost.gif_url || null,
          profile: rawPost.profiles ? {
            username: rawPost.profiles.username,
            avatar_url: rawPost.profiles.avatar_url
          } : undefined,
          group: { name: 'Unknown Group' }
        };

        // Handle group data with null checks
        if (rawPost.group && typeof rawPost.group === 'object' && 'name' in rawPost.group) {
          post.group = { name: String(rawPost.group.name) };
        }

        // Handle poll data with null checks
        if (rawPost.poll && typeof rawPost.poll === 'object') {
          const pollOptions: PollOption[] = [];
          
          if (rawPost.poll.options && Array.isArray(rawPost.poll.options)) {
            for (const opt of rawPost.poll.options) {
              if (typeof opt === 'string') {
                pollOptions.push({ id: crypto.randomUUID(), text: opt });
              } else if (opt && typeof opt === 'object' && 'text' in opt) {
                pollOptions.push({ 
                  id: ('id' in opt && opt.id) ? String(opt.id) : crypto.randomUUID(), 
                  text: String(opt.text)
                });
              } else {
                // Handle potential null or undefined options
                const optText = opt ? String(opt) : '';
                pollOptions.push({ id: crypto.randomUUID(), text: optText });
              }
            }
          }

          // Only add poll if we have a valid poll structure
          if (rawPost.poll.id && rawPost.poll.question) {
            post.poll = {
              id: String(rawPost.poll.id),
              question: String(rawPost.poll.question),
              options: pollOptions,
              votes: Array.isArray(rawPost.poll.votes) 
                ? rawPost.poll.votes.map(vote => ({
                    id: String(vote.id),
                    poll_id: String(vote.poll_id),
                    user_id: String(vote.user_id),
                    option_index: Number(vote.option_index)
                  }))
                : []
            };
          }
        }

        transformedPosts.push(post);
      }

      setPosts(transformedPosts);
    } catch (transformError) {
      console.error('Error transforming posts data:', transformError);
      setPosts([]);
    }
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
