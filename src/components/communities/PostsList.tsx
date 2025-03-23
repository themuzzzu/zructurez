
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
        // Create the post object with type safety
        const post: Post = {
          id: rawPost.id,
          user_id: rawPost.user_id,
          // Handle various ID fields with explicit type checking
          group_id: typeof rawPost.group_id === 'string' ? rawPost.group_id :
                  typeof rawPost.business_id === 'string' ? rawPost.business_id : '',
          content: rawPost.content,
          created_at: rawPost.created_at,
          // Handle optional fields
          image_url: typeof rawPost.image_url === 'string' ? rawPost.image_url : null,
          poll_id: typeof rawPost.poll_id === 'string' ? rawPost.poll_id : null,
          gif_url: typeof rawPost.gif_url === 'string' ? rawPost.gif_url : null,
          // Set default profile if it doesn't exist
          profile: rawPost.profiles && typeof rawPost.profiles === 'object' ? {
            username: String(rawPost.profiles.username || ''),
            avatar_url: String(rawPost.profiles.avatar_url || '')
          } : undefined,
          // Set default group
          group: { name: 'Unknown Group' }
        };

        // Handle group data with null checks and type guarding
        if (rawPost.group && 
            typeof rawPost.group === 'object' && 
            rawPost.group !== null && 
            'name' in rawPost.group && 
            rawPost.group.name) {
          post.group = { name: String(rawPost.group.name) };
        }

        // Handle poll data with comprehensive null checks and type guarding
        if (rawPost.poll && 
            typeof rawPost.poll === 'object' && 
            rawPost.poll !== null) {
          // Only process poll if it has valid structure
          const pollObj = rawPost.poll;
          
          if (pollObj.id && pollObj.question) {
            const pollOptions: PollOption[] = [];
            
            // Process options safely if they exist and are an array
            if (pollObj.options && Array.isArray(pollObj.options)) {
              for (const opt of pollObj.options) {
                if (typeof opt === 'string') {
                  // Handle string options
                  pollOptions.push({ id: crypto.randomUUID(), text: opt });
                } else if (opt && typeof opt === 'object' && 'text' in opt) {
                  // Handle object options with text property
                  pollOptions.push({ 
                    id: ('id' in opt && opt.id) ? String(opt.id) : crypto.randomUUID(), 
                    text: String(opt.text)
                  });
                } else if (opt) {
                  // Handle any other non-null value by converting to string
                  pollOptions.push({ id: crypto.randomUUID(), text: String(opt) });
                } else {
                  // Handle null or undefined
                  pollOptions.push({ id: crypto.randomUUID(), text: '' });
                }
              }
            }

            // Process votes if they exist and are an array
            const pollVotes: PollVote[] = [];
            if (pollObj.votes && Array.isArray(pollObj.votes)) {
              for (const vote of pollObj.votes) {
                if (vote && typeof vote === 'object' && 
                    'id' in vote && 'poll_id' in vote && 
                    'user_id' in vote && 'option_index' in vote) {
                  pollVotes.push({
                    id: String(vote.id),
                    poll_id: String(vote.poll_id),
                    user_id: String(vote.user_id),
                    option_index: Number(vote.option_index)
                  });
                }
              }
            }

            // Create the poll object
            post.poll = {
              id: String(pollObj.id),
              question: String(pollObj.question),
              options: pollOptions,
              votes: pollVotes
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
