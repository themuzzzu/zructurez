
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

// Define a simpler type for raw posts from the database
// This avoids recursive type definitions
interface RawPostData {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  business_id?: string | null;
  category?: string;
  location?: string;
  profile_id?: string;
  views?: number;
  image_url?: string | null;
  group_id?: string | null;
  poll_id?: string | null;
  gif_url?: string | null;
  profiles?: {
    username: string;
    avatar_url: string;
  } | null;
  group?: {
    name?: string;
  } | null;
  poll?: {
    id?: string;
    question?: string;
    options?: any;
    votes?: any;
  } | null;
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
      
      for (const rawPost of data as RawPostData[]) {
        // Create the post object with type safety
        const post: Post = {
          id: rawPost.id,
          user_id: rawPost.user_id,
          // Handle group_id or business_id as fallback
          group_id: rawPost.group_id || rawPost.business_id || '',
          content: rawPost.content,
          created_at: rawPost.created_at,
          // Handle optional fields
          image_url: rawPost.image_url,
          poll_id: rawPost.poll_id,
          gif_url: rawPost.gif_url,
          // Set default group
          group: { name: 'Unknown Group' }
        };

        // Handle profile data safely
        if (rawPost.profiles) {
          post.profile = {
            username: String(rawPost.profiles.username || ''),
            avatar_url: String(rawPost.profiles.avatar_url || '')
          };
        }

        // Handle group data safely
        if (rawPost.group) {
          post.group = { 
            name: rawPost.group.name ? String(rawPost.group.name) : 'Unknown Group' 
          };
        }

        // Handle poll data with comprehensive null checks
        if (rawPost.poll) {
          const pollObj = rawPost.poll;
          
          if (pollObj && pollObj.id && pollObj.question) {
            const pollOptions: PollOption[] = [];
            
            // Process options safely
            if (pollObj.options && Array.isArray(pollObj.options)) {
              // Type the options array correctly
              const optionsArray = pollObj.options as any[];
              
              optionsArray.forEach(opt => {
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
                }
              });
            }

            // Process votes if they exist
            const pollVotes: PollVote[] = [];
            if (pollObj.votes && Array.isArray(pollObj.votes)) {
              // Type the votes array correctly
              const votesArray = pollObj.votes as any[];
              
              votesArray.forEach(vote => {
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
              });
            }

            // Create the poll object with safe typed values
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
